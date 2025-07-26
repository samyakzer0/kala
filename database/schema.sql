-- Kala Jewelry E-commerce Database Schema for Supabase
-- Run these commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_data JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'shipped', 'delivered')),
    admin_notes TEXT,
    approved_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    delivery_notes TEXT,
    shipping JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    gem_color VARCHAR(7),
    description TEXT NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    new BOOLEAN DEFAULT FALSE,
    bestseller BOOLEAN DEFAULT FALSE,
    image TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id TEXT NOT NULL,
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('product', 'category')),
    views INTEGER DEFAULT 0,
    orders INTEGER DEFAULT 0,
    last_viewed TIMESTAMPTZ,
    last_ordered TIMESTAMPTZ,
    popularity_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entity_id, entity_type)
);

-- Create indexes for performance
-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders USING GIN ((customer_data->>'email'));
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_updated_at ON orders(updated_at DESC);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_new ON products(new) WHERE new = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(bestseller) WHERE bestseller = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_products_low_stock ON products(stock, low_stock_threshold) WHERE stock <= low_stock_threshold;
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN (to_tsvector('english', name || ' ' || description || ' ' || category || ' ' || COALESCE(subcategory, '')));

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_entity ON analytics(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_analytics_popularity ON analytics(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_views ON analytics(views DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_orders ON analytics(orders DESC);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for auto-updating updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_analytics_updated_at ON analytics;
CREATE TRIGGER update_analytics_updated_at
    BEFORE UPDATE ON analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for service role (full access)
-- Orders policies
DROP POLICY IF EXISTS "Service role can manage orders" ON orders;
CREATE POLICY "Service role can manage orders" ON orders
    FOR ALL USING (auth.role() = 'service_role');

-- Products policies
DROP POLICY IF EXISTS "Service role can manage products" ON products;
CREATE POLICY "Service role can manage products" ON products
    FOR ALL USING (auth.role() = 'service_role');

-- Public can read active products
DROP POLICY IF EXISTS "Public can read active products" ON products;
CREATE POLICY "Public can read active products" ON products
    FOR SELECT USING (is_active = TRUE);

-- Analytics policies
DROP POLICY IF EXISTS "Service role can manage analytics" ON analytics;
CREATE POLICY "Service role can manage analytics" ON analytics
    FOR ALL USING (auth.role() = 'service_role');

-- Create helpful views
-- Order summary view
CREATE OR REPLACE VIEW order_summary AS
SELECT 
    id,
    customer_data->>'email' as customer_email,
    customer_data->>'firstName' as customer_first_name,
    customer_data->>'lastName' as customer_last_name,
    jsonb_array_length(items) as item_count,
    subtotal,
    status,
    created_at,
    updated_at
FROM orders;

-- Product inventory view
CREATE OR REPLACE VIEW product_inventory AS
SELECT 
    id,
    name,
    category,
    subcategory,
    price,
    stock,
    low_stock_threshold,
    CASE 
        WHEN stock = 0 THEN 'out_of_stock'
        WHEN stock <= low_stock_threshold THEN 'low_stock'
        ELSE 'in_stock'
    END as stock_status,
    is_active,
    created_at,
    updated_at
FROM products;

-- Popular products view
CREATE OR REPLACE VIEW popular_products AS
SELECT 
    p.id,
    p.name,
    p.category,
    p.price,
    p.image,
    a.views,
    a.orders,
    a.popularity_score
FROM products p
LEFT JOIN analytics a ON p.id = a.entity_id AND a.entity_type = 'product'
WHERE p.is_active = TRUE
ORDER BY a.popularity_score DESC NULLS LAST;

-- Order statistics view
CREATE OR REPLACE VIEW order_statistics AS
SELECT
    COUNT(*) as total_orders,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_orders,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_orders,
    COUNT(*) FILTER (WHERE status = 'shipped') as shipped_orders,
    COUNT(*) FILTER (WHERE status = 'delivered') as delivered_orders,
    COALESCE(SUM(subtotal) FILTER (WHERE status != 'rejected'), 0) as total_revenue,
    COALESCE(AVG(subtotal) FILTER (WHERE status != 'rejected'), 0) as average_order_value,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as orders_last_30_days,
    COALESCE(SUM(subtotal) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days' AND status != 'rejected'), 0) as revenue_last_30_days
FROM orders;

-- Create a function to get order count by status
CREATE OR REPLACE FUNCTION get_orders_by_status()
RETURNS TABLE(status_name TEXT, order_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.status::TEXT as status_name,
        COUNT(*)::BIGINT as order_count
    FROM orders o
    GROUP BY o.status
    ORDER BY o.status;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get low stock alerts
CREATE OR REPLACE FUNCTION get_low_stock_alerts()
RETURNS TABLE(
    product_id TEXT,
    product_name TEXT,
    current_stock INTEGER,
    threshold INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.stock,
        p.low_stock_threshold
    FROM products p
    WHERE p.is_active = TRUE 
    AND p.stock <= p.low_stock_threshold
    ORDER BY p.stock ASC;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Insert some initial data categories for analytics if needed
INSERT INTO analytics (entity_id, entity_type, views, orders, popularity_score, created_at, updated_at)
VALUES 
    ('all', 'category', 0, 0, 0, NOW(), NOW()),
    ('rings', 'category', 0, 0, 0, NOW(), NOW()),
    ('necklaces', 'category', 0, 0, 0, NOW(), NOW()),
    ('earrings', 'category', 0, 0, 0, NOW(), NOW()),
    ('bracelets', 'category', 0, 0, 0, NOW(), NOW())
ON CONFLICT (entity_id, entity_type) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Kala Jewelry database schema created successfully!';
    RAISE NOTICE 'Tables created: orders, products, analytics';
    RAISE NOTICE 'Views created: order_summary, product_inventory, popular_products, order_statistics';
    RAISE NOTICE 'Functions created: get_orders_by_status(), get_low_stock_alerts()';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Set up your environment variables';
    RAISE NOTICE '2. Run the data migration script';
    RAISE NOTICE '3. Update your API routes to use the new services';
END $$;
