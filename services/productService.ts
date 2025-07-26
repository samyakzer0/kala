import { supabaseAdmin, isSupabaseConfigured, Database } from '../lib/supabase';
import { Product, ProductFormData } from '../types/product';

// Product service class for Supabase operations
export class ProductService {
  private static isConfigured = isSupabaseConfigured();

  // Helper method to ensure Supabase is configured
  private static ensureConfigured(): void {
    if (!this.isConfigured || !supabaseAdmin) {
      throw new Error('Supabase is not properly configured');
    }
  }

  // Get the configured supabase admin instance
  private static getSupabaseAdmin() {
    this.ensureConfigured();
    return supabaseAdmin!; // Safe to use ! here since we just checked
  }

  // Generate unique product ID
  private static generateProductId(): string {
    return `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create a new product
  static async createProduct(productData: ProductFormData, imageFile?: File): Promise<Product> {
    this.ensureConfigured();

    try {
      const productId = this.generateProductId();
      const now = new Date().toISOString();

      // Handle image path - either from imageFile parameter or from productData.image
      let imagePath: string | undefined;
      if (imageFile) {
        imagePath = `/images/products/${productId}-${imageFile.name}`;
      } else if (productData.image) {
        imagePath = productData.image;
      }

      const { data, error } = await this.getSupabaseAdmin()
        .from('products')
        .insert({
          id: productId,
          name: productData.name,
          price: productData.price,
          category: productData.category,
          subcategory: productData.subcategory,
          gem_color: productData.gemColor,
          description: productData.description,
          featured: productData.featured || false,
          new: productData.new || false,
          bestseller: productData.bestseller || false,
          stock: productData.stock,
          low_stock_threshold: productData.lowStockThreshold || 5,
          is_active: productData.isActive !== false,
          image: imagePath,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating product:', error);
        throw new Error(`Failed to create product: ${error.message}`);
      }

      return this.transformDbProductToProduct(data);
    } catch (error) {
      console.error('Product creation failed:', error);
      throw error;
    }
  }

  // Get all products
  static async getAllProducts(): Promise<Product[]> {
    this.ensureConfigured();

    try {
      const { data, error } = await this.getSupabaseAdmin()
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all products:', error);
        throw new Error(`Failed to fetch products: ${error.message}`);
      }

      return data.map(product => this.transformDbProductToProduct(product));
    } catch (error) {
      console.error('Products fetch failed:', error);
      throw error;
    }
  }

  // Get product by ID
  static async getProductById(productId: string): Promise<Product | null> {
    this.ensureConfigured();

    try {
      const { data, error } = await this.getSupabaseAdmin()
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Product not found
        }
        console.error('Error fetching product:', error);
        throw new Error(`Failed to fetch product: ${error.message}`);
      }

      return this.transformDbProductToProduct(data);
    } catch (error) {
      console.error('Product fetch failed:', error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(productId: string, updates: Partial<ProductFormData>): Promise<Product | null> {
    this.ensureConfigured();

    try {
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Map frontend field names to database field names
      if (updates.gemColor !== undefined) {
        updateData.gem_color = updates.gemColor;
        delete updateData.gemColor;
      }
      if (updates.lowStockThreshold !== undefined) {
        updateData.low_stock_threshold = updates.lowStockThreshold;
        delete updateData.lowStockThreshold;
      }
      if (updates.isActive !== undefined) {
        updateData.is_active = updates.isActive;
        delete updateData.isActive;
      }

      const { data, error } = await this.getSupabaseAdmin()
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        throw new Error(`Failed to update product: ${error.message}`);
      }

      return this.transformDbProductToProduct(data);
    } catch (error) {
      console.error('Product update failed:', error);
      throw error;
    }
  }

  // Update product stock
  static async updateProductStock(productId: string, newStock: number): Promise<Product | null> {
    this.ensureConfigured();

    try {
      const { data, error } = await this.getSupabaseAdmin()
        .from('products')
        .update({ 
          stock: newStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        console.error('Error updating product stock:', error);
        throw new Error(`Failed to update product stock: ${error.message}`);
      }

      return this.transformDbProductToProduct(data);
    } catch (error) {
      console.error('Product stock update failed:', error);
      throw error;
    }
  }

  // Decrease product stock (when order is placed)
  static async decreaseProductStock(productId: string, quantity: number): Promise<boolean> {
    this.ensureConfigured();

    try {
      // First get current stock
      const product = await this.getProductById(productId);
      if (!product || product.stock < quantity) {
        return false;
      }

      // Update stock
      const newStock = product.stock - quantity;
      await this.updateProductStock(productId, newStock);
      return true;
    } catch (error) {
      console.error('Product stock decrease failed:', error);
      return false;
    }
  }

  // Check if product is in stock
  static async isProductInStock(productId: string, quantity: number = 1): Promise<boolean> {
    try {
      const product = await this.getProductById(productId);
      return product ? product.stock >= quantity : false;
    } catch (error) {
      console.error('Stock check failed:', error);
      return false;
    }
  }

  // Get low stock products
  static async getLowStockProducts(): Promise<Product[]> {
    this.ensureConfigured();

    try {
      const { data, error } = await this.getSupabaseAdmin()
        .from('products')
        .select('*')
        .eq('is_active', true)
        .filter('stock', 'lte', 'low_stock_threshold')
        .order('stock', { ascending: true });

      if (error) {
        console.error('Error fetching low stock products:', error);
        throw new Error(`Failed to fetch low stock products: ${error.message}`);
      }

      return data.map(product => this.transformDbProductToProduct(product));
    } catch (error) {
      console.error('Low stock products fetch failed:', error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(productId: string): Promise<boolean> {
    this.ensureConfigured();

    try {
      const { error } = await this.getSupabaseAdmin()
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error deleting product:', error);
        throw new Error(`Failed to delete product: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Product deletion failed:', error);
      return false;
    }
  }

  // Get products by category
  static async getProductsByCategory(category: string): Promise<Product[]> {
    this.ensureConfigured();

    try {
      const { data, error } = await this.getSupabaseAdmin()
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products by category:', error);
        throw new Error(`Failed to fetch products by category: ${error.message}`);
      }

      return data.map(product => this.transformDbProductToProduct(product));
    } catch (error) {
      console.error('Products by category fetch failed:', error);
      throw error;
    }
  }

  // Search products
  static async searchProducts(query: string): Promise<Product[]> {
    this.ensureConfigured();

    try {
      const { data, error } = await this.getSupabaseAdmin()
        .from('products')
        .select('*')
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching products:', error);
        throw new Error(`Failed to search products: ${error.message}`);
      }

      return data.map(product => this.transformDbProductToProduct(product));
    } catch (error) {
      console.error('Product search failed:', error);
      throw error;
    }
  }

  // Get inventory statistics
  static async getInventoryStats(): Promise<{
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    totalStockValue: number;
    categories: { [key: string]: number };
  }> {
    this.ensureConfigured();

    try {
      const { data: products, error } = await this.getSupabaseAdmin()
        .from('products')
        .select('*');

      if (error) {
        console.error('Error fetching inventory stats:', error);
        throw new Error(`Failed to fetch inventory stats: ${error.message}`);
      }

      const stats = {
        totalProducts: products.length,
        activeProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        totalStockValue: 0,
        categories: {} as { [key: string]: number }
      };

      products.forEach(product => {
        if (product.is_active) {
          stats.activeProducts++;
          stats.totalStockValue += product.price * product.stock;

          if (product.stock === 0) {
            stats.outOfStockProducts++;
          } else if (product.stock <= product.low_stock_threshold) {
            stats.lowStockProducts++;
          }

          stats.categories[product.category] = (stats.categories[product.category] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      console.error('Inventory stats fetch failed:', error);
      throw error;
    }
  }

  // Transform database product to frontend Product type
  private static transformDbProductToProduct(dbProduct: Database['public']['Tables']['products']['Row']): Product {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      price: dbProduct.price,
      category: dbProduct.category,
      subcategory: dbProduct.subcategory || undefined,
      gemColor: dbProduct.gem_color || undefined,
      description: dbProduct.description,
      featured: dbProduct.featured,
      new: dbProduct.new,
      bestseller: dbProduct.bestseller,
      image: dbProduct.image || undefined,
      stock: dbProduct.stock,
      lowStockThreshold: dbProduct.low_stock_threshold,
      isActive: dbProduct.is_active,
      createdAt: dbProduct.created_at,
      updatedAt: dbProduct.updated_at
    };
  }
}
