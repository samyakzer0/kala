'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Product, ProductFormData } from '../../types/product';

interface Order {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
  }>;
  subtotal: number;
  status: 'pending' | 'approved' | 'rejected' | 'shipped' | 'delivered';
  createdAt: string;
  approvedAt?: string;
  adminNotes?: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'inventory'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  
  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    price: 0,
    category: 'rings',
    subcategory: '',
    gemColor: '',
    description: '',
    featured: false,
    new: false,
    bestseller: false,
    stock: 0,
    lowStockThreshold: 5,
    isActive: true
  });
  
  // Inventory stats
  const [inventoryStats, setInventoryStats] = useState<any>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  // Simple authentication
  const handleLogin = () => {
    if (adminKey === 'kala-admin-2024') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('Invalid admin key');
    }
  };

  const fetchData = async () => {
    await Promise.all([fetchOrders(), fetchProducts()]);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/orders?adminKey=${encodeURIComponent(adminKey)}`);
      const result = await response.json();
      
      if (result.success) {
        setOrders(result.orders);
        console.log('📊 Order statistics:', result.stats);
      } else {
        console.error('Failed to fetch orders:', result.message);
        alert('Failed to fetch orders: ' + result.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Error fetching orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/admin/products?adminKey=${encodeURIComponent(adminKey)}`);
      const result = await response.json();
      
      if (result.success) {
        setProducts(result.products);
        setInventoryStats(result.stats);
      } else {
        console.error('Failed to fetch products:', result.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchLowStockProducts = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/inventory?adminKey=${encodeURIComponent(adminKey)}&action=low-stock`);
      const result = await response.json();
      
      if (result.success) {
        setLowStockProducts(result.products);
      }
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    }
  }, [adminKey]);

  // Seed database with sample products - defined but not used in UI currently
  // Keeping for future implementation or documentation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleSeedDatabase = async () => {
    if (!confirm('This will add sample products and analytics data. Continue?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/seed-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Database seeded successfully!');
        await fetchProducts(); // Refresh products list
      } else {
        alert('Failed to seed database: ' + result.message);
      }
    } catch (error) {
      console.error('Error seeding database:', error);
      alert('Error seeding database');
    } finally {
      setLoading(false);
    }
  };

  // Product management functions
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;
    
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('adminKey', adminKey);
    formData.append('category', productForm.category);
    
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.imagePath;
      } else {
        alert('Failed to upload image: ' + result.message);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
      return null;
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Upload image first if one is selected
      let imagePath = null;
      if (selectedImage) {
        imagePath = await uploadImage();
        if (!imagePath) {
          setLoading(false);
          return; // Stop if image upload failed
        }
      }
      
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...productForm, 
          image: imagePath,
          adminKey 
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setProducts(prev => [...prev, result.product]);
        setShowProductForm(false);
        resetProductForm();
        alert('Product created successfully!');
      } else {
        alert('Failed to create product: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setLoading(true);
    
    try {
      // Upload new image if one is selected
      let imagePath = editingProduct.image; // Keep existing image by default
      if (selectedImage) {
        const newImagePath = await uploadImage();
        if (newImagePath) {
          imagePath = newImagePath;
        }
      }
      
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...productForm, 
          image: imagePath,
          productId: editingProduct.id, 
          adminKey 
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? result.product : p));
        setEditingProduct(null);
        setShowProductForm(false);
        resetProductForm();
        alert('Product updated successfully!');
      } else {
        alert('Failed to update product: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/admin/products?adminKey=${encodeURIComponent(adminKey)}&productId=${productId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        alert('Product deleted successfully!');
      } else {
        alert('Failed to delete product: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      const response = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, stock: newStock, adminKey })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, stock: newStock } : p
        ));
        await fetchLowStockProducts(); // Refresh low stock list
        alert('Stock updated successfully!');
      } else {
        alert('Failed to update stock: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock');
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: 0,
      category: 'rings',
      subcategory: '',
      gemColor: '',
      description: '',
      featured: false,
      new: false,
      bestseller: false,
      stock: 0,
      lowStockThreshold: 5,
      isActive: true
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory || '',
      gemColor: product.gemColor || '',
      description: product.description,
      featured: product.featured || false,
      new: product.new || false,
      bestseller: product.bestseller || false,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      isActive: product.isActive
    });
    setImagePreview(product.image || null);
    setSelectedImage(null);
    setShowProductForm(true);
  };

  // Load low stock products when inventory tab is active
  useEffect(() => {
    if (isAuthenticated && activeTab === 'inventory') {
      fetchLowStockProducts();
    }
  }, [activeTab, isAuthenticated, fetchLowStockProducts]);

  const handleOrderAction = async (orderId: string, action: 'approved' | 'rejected', notes?: string) => {
    setProcessingOrderId(orderId);
    
    try {
      const response = await fetch('/api/admin/approve-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          action,
          adminNotes: notes,
          adminKey
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status: action, adminNotes: notes, approvedAt: new Date().toISOString() }
            : order
        ));
        alert(`Order ${action} successfully!`);
      } else {
        alert(`Failed to ${action} order: ${result.message}`);
      }
    } catch (error) {
      console.error(`Error ${action} order:`, error);
      alert(`Error ${action} order. Please try again.`);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-primary-500 flex items-center justify-center py-12">
          <div className="max-w-md w-full bg-ivory-400 p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6 text-primary-700">Admin Login</h1>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Enter admin key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-3 border border-primary-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                onClick={handleLogin}
                className="w-full bg-ivory-400 text-primary-500 py-3 px-6 rounded-full hover:bg-ivory-300 transition-colors font-medium shadow-lg border border-primary-200"
              >
                Login
              </button>
            </div>
            <p className="text-sm text-primary-500 mt-4 text-center">
              Demo admin key: kala-admin-2024
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-primary-500">
        <div className="bg-ivory-400 shadow-sm border-b border-primary-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-primary-700">Jewelry Store - Admin Panel</h1>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-primary-600 hover:text-primary-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-ivory-300 border-b border-primary-200">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8">
              {[
                { id: 'orders', label: 'Orders' },
                { id: 'products', label: 'Products' },
                { id: 'inventory', label: 'Inventory' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-secondary-500 text-secondary-600'
                      : 'border-transparent text-primary-600 hover:text-primary-700 hover:border-primary-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-ivory-400">Order Management</h2>
                <button
                  onClick={fetchOrders}
                  disabled={loading}
                  className="bg-ivory-400 text-primary-500 px-6 py-2 rounded-full hover:bg-ivory-300 disabled:opacity-50 font-medium shadow-lg border border-primary-200"
                >
                  {loading ? 'Loading...' : 'Refresh Orders'}
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-500 mx-auto"></div>
                  <p className="mt-2 text-ivory-300">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-ivory-300">No orders found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      className="bg-ivory-400 p-6 rounded-lg shadow-lg border border-primary-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-primary-700">Order #{order.id}</h3>
                          <p className="text-primary-600">
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-medium mb-2 text-primary-700">Customer Information</h4>
                          <div className="text-sm space-y-1 text-primary-600">
                            <p><strong>Name:</strong> {order.customer.firstName} {order.customer.lastName}</p>
                            <p><strong>Email:</strong> {order.customer.email}</p>
                            <p><strong>Phone:</strong> {order.customer.phone}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2 text-primary-700">Shipping Address</h4>
                          <div className="text-sm text-primary-600">
                            <p>{order.customer.address}</p>
                            <p>{order.customer.city}, {order.customer.state} {order.customer.zipCode}</p>
                            <p>{order.customer.country}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium mb-2 text-primary-700">Items</h4>
                        <div className="bg-ivory-200 p-4 rounded-md">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2">
                              <div>
                                <p className="font-medium text-primary-700">{item.name}</p>
                                <p className="text-sm text-primary-600">Quantity: {item.quantity}</p>
                              </div>
                              <p className="font-medium text-primary-700">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between items-center font-bold text-primary-700">
                              <span>Total:</span>
                              <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {order.status === 'pending' && (
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleOrderAction(order.id, 'approved')}
                            disabled={processingOrderId === order.id}
                            className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 disabled:opacity-50 font-medium shadow-lg"
                          >
                            {processingOrderId === order.id ? 'Processing...' : 'Approve Order'}
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Reason for rejection (optional):');
                              handleOrderAction(order.id, 'rejected', reason || undefined);
                            }}
                            disabled={processingOrderId === order.id}
                            className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 disabled:opacity-50 font-medium shadow-lg"
                          >
                            Reject Order
                          </button>
                        </div>
                      )}

                      {order.adminNotes && (
                        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-md">
                          <p className="text-sm text-yellow-800"><strong>Admin Notes:</strong> {order.adminNotes}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-ivory-400">Product Management</h2>
                <div className="flex gap-4">
                  <button
                    onClick={fetchProducts}
                    disabled={loading}
                    className="bg-ivory-400 text-primary-500 px-6 py-2 rounded-full hover:bg-ivory-300 disabled:opacity-50 font-medium shadow-lg border border-primary-200"
                  >
                    {loading ? 'Loading...' : 'Refresh Products'}
                  </button>
                  <button
                    onClick={() => setShowProductForm(true)}
                    className="bg-secondary-500 text-white px-6 py-2 rounded-full hover:bg-secondary-600 font-medium shadow-lg"
                  >
                    Add New Product
                  </button>
                </div>
              </div>

              {/* Product Form Modal */}
              {showProductForm && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-ivory-400 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-bold mb-4 text-primary-700">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    
                    <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-primary-700 mb-1">Product Name</label>
                          <input
                            type="text"
                            value={productForm.name}
                            onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                            className="w-full px-3 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-secondary-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-primary-700 mb-1">Price ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-secondary-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-primary-700 mb-1">Category</label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                            className="w-full px-3 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-secondary-500"
                          >
                            <option value="rings">Rings</option>
                            <option value="necklaces">Necklaces</option>
                            <option value="earrings">Earrings</option>
                            <option value="bracelets">Bracelets</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-primary-700 mb-1">Subcategory</label>
                          <input
                            type="text"
                            value={productForm.subcategory}
                            onChange={(e) => setProductForm({...productForm, subcategory: e.target.value})}
                            className="w-full px-3 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-secondary-500"
                            placeholder="e.g., engagement, casual"
                          />
                        </div>
                      </div>
                      
                      {/* Image Upload Section */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-primary-700 mb-2">Product Image</label>
                        <div className="space-y-3">
                          {/* Current/Preview Image */}
                          {(imagePreview || (editingProduct && editingProduct.image)) && (
                            <div className="relative w-32 h-32 border-2 border-primary-300 rounded-lg overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imagePreview || editingProduct?.image}
                                alt="Product preview"
                                className="w-full h-full object-cover"
                              />
                              {imagePreview && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedImage(null);
                                    setImagePreview(null);
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          )}
                          
                          {/* File Input */}
                          <div className="flex items-center space-x-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                              id="product-image"
                            />
                            <label
                              htmlFor="product-image"
                              className="bg-primary-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary-600 transition-colors"
                            >
                              {editingProduct && editingProduct.image && !imagePreview 
                                ? 'Change Image' 
                                : 'Choose Image'
                              }
                            </label>
                            <span className="text-sm text-primary-600">
                              {selectedImage ? selectedImage.name : 'No file selected'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-primary-700 mb-1">Stock Quantity</label>
                          <input
                            type="number"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({...productForm, stock: parseInt(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-secondary-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-primary-700 mb-1">Low Stock Threshold</label>
                          <input
                            type="number"
                            value={productForm.lowStockThreshold}
                            onChange={(e) => setProductForm({...productForm, lowStockThreshold: parseInt(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-secondary-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-primary-700 mb-1">Gem Color</label>
                          <input
                            type="text"
                            value={productForm.gemColor}
                            onChange={(e) => setProductForm({...productForm, gemColor: e.target.value})}
                            className="w-full px-3 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-secondary-500"
                            placeholder="#FFFFFF or color name"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-primary-700 mb-1">Description</label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                          className="w-full px-3 py-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-secondary-500"
                          rows={3}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={productForm.featured}
                            onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                            className="mr-2"
                          />
                          <span className="text-sm text-primary-700">Featured</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={productForm.new}
                            onChange={(e) => setProductForm({...productForm, new: e.target.checked})}
                            className="mr-2"
                          />
                          <span className="text-sm text-primary-700">New</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={productForm.bestseller}
                            onChange={(e) => setProductForm({...productForm, bestseller: e.target.checked})}
                            className="mr-2"
                          />
                          <span className="text-sm text-primary-700">Bestseller</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={productForm.isActive}
                            onChange={(e) => setProductForm({...productForm, isActive: e.target.checked})}
                            className="mr-2"
                          />
                          <span className="text-sm text-primary-700">Active</span>
                        </label>
                      </div>
                      
                      <div className="flex gap-4 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                            resetProductForm();
                          }}
                          className="px-6 py-2 border border-primary-300 text-primary-600 rounded-full hover:bg-ivory-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-secondary-500 text-white px-6 py-2 rounded-full hover:bg-secondary-600 disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* Products List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    className="bg-ivory-400 p-4 rounded-lg shadow-lg border border-primary-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="aspect-square bg-ivory-200 rounded-lg mb-4 flex items-center justify-center">
                      {product.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="text-primary-500 text-4xl">📷</div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-primary-700 mb-2">{product.name}</h3>
                    <p className="text-primary-600 mb-2">${product.price}</p>
                    <p className="text-sm text-primary-500 mb-2">Stock: {product.stock}</p>
                    <p className="text-sm text-primary-500 mb-4">Category: {product.category}</p>
                    
                    <div className="flex gap-2 mb-4">
                      {product.featured && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Featured</span>}
                      {product.new && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">New</span>}
                      {product.bestseller && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Bestseller</span>}
                      {!product.isActive && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Inactive</span>}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditProduct(product)}
                        className="flex-1 bg-secondary-500 text-white py-2 px-4 rounded-full text-sm hover:bg-secondary-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-full text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-ivory-400 mb-4">Inventory Management</h2>
                
                {inventoryStats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-ivory-400 p-4 rounded-lg border border-primary-200">
                      <h3 className="text-sm font-medium text-primary-600">Total Products</h3>
                      <p className="text-2xl font-bold text-primary-700">{inventoryStats.totalProducts}</p>
                    </div>
                    <div className="bg-ivory-400 p-4 rounded-lg border border-primary-200">
                      <h3 className="text-sm font-medium text-primary-600">Active Products</h3>
                      <p className="text-2xl font-bold text-green-600">{inventoryStats.activeProducts}</p>
                    </div>
                    <div className="bg-ivory-400 p-4 rounded-lg border border-primary-200">
                      <h3 className="text-sm font-medium text-primary-600">Low Stock</h3>
                      <p className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStockProducts}</p>
                    </div>
                    <div className="bg-ivory-400 p-4 rounded-lg border border-primary-200">
                      <h3 className="text-sm font-medium text-primary-600">Out of Stock</h3>
                      <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStockProducts}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Low Stock Alerts */}
              {lowStockProducts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-4">🚨 Low Stock Alerts</h3>
                  <div className="space-y-3">
                    {lowStockProducts.map((product) => (
                      <div key={product.id} className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-red-800">{product.name}</h4>
                            <p className="text-sm text-red-600">
                              Current Stock: {product.stock} | Threshold: {product.lowStockThreshold}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="New stock"
                              className="w-24 px-2 py-1 border border-red-300 rounded text-sm"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const input = e.target as HTMLInputElement;
                                  const newStock = parseInt(input.value);
                                  if (newStock > 0) {
                                    handleUpdateStock(product.id, newStock);
                                    input.value = '';
                                  }
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                const newStock = prompt(`Update stock for ${product.name} (current: ${product.stock}):`);
                                if (newStock && parseInt(newStock) >= 0) {
                                  handleUpdateStock(product.id, parseInt(newStock));
                                }
                              }}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Products Stock Management */}
              <div>
                <h3 className="text-lg font-semibold text-ivory-400 mb-4">All Products Stock</h3>
                <div className="bg-ivory-400 rounded-lg overflow-hidden shadow-lg border border-primary-200">
                  <table className="w-full">
                    <thead className="bg-primary-600 text-ivory-400">
                      <tr>
                        <th className="px-4 py-3 text-left">Product</th>
                        <th className="px-4 py-3 text-left">Category</th>
                        <th className="px-4 py-3 text-left">Current Stock</th>
                        <th className="px-4 py-3 text-left">Low Stock Threshold</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-t border-primary-200">
                          <td className="px-4 py-3 text-primary-700 font-medium">{product.name}</td>
                          <td className="px-4 py-3 text-primary-600">{product.category}</td>
                          <td className="px-4 py-3">
                            <span className={`font-medium ${
                              product.stock === 0 ? 'text-red-600' :
                              product.stock <= product.lowStockThreshold ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-primary-600">{product.lowStockThreshold}</td>
                          <td className="px-4 py-3">
                            {product.stock === 0 ? (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Out of Stock</span>
                            ) : product.stock <= product.lowStockThreshold ? (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Low Stock</span>
                            ) : (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">In Stock</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => {
                                const newStock = prompt(`Update stock for ${product.name} (current: ${product.stock}):`);
                                if (newStock && parseInt(newStock) >= 0) {
                                  handleUpdateStock(product.id, parseInt(newStock));
                                }
                              }}
                              className="bg-secondary-500 text-white px-3 py-1 rounded-full text-sm hover:bg-secondary-600"
                            >
                              Update Stock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
