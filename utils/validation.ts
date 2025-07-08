import { ProductFormData } from '../types/product';

/**
 * Input validation and sanitization utilities
 */

// HTML encoding to prevent XSS
export function encodeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Sanitize string input
export function sanitizeString(input: string, maxLength: number = 255): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  // Trim whitespace and limit length
  const sanitized = input.trim().substring(0, maxLength);
  
  // Remove potentially dangerous characters
  return sanitized.replace(/[<>\"'&]/g, '');
}

// Validate email format
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validate numeric input
export function validateNumber(value: any, min?: number, max?: number): number {
  const num = parseFloat(value);
  
  if (isNaN(num) || !isFinite(num)) {
    throw new Error('Invalid number');
  }
  
  if (min !== undefined && num < min) {
    throw new Error(`Number must be at least ${min}`);
  }
  
  if (max !== undefined && num > max) {
    throw new Error(`Number must be at most ${max}`);
  }
  
  return num;
}

// Validate product category
export function validateCategory(category: string): string {
  const allowedCategories = ['rings', 'necklaces', 'earrings', 'bracelets'];
  const normalized = category.toLowerCase().trim();
  
  if (!allowedCategories.includes(normalized)) {
    throw new Error(`Invalid category. Must be one of: ${allowedCategories.join(', ')}`);
  }
  
  return normalized;
}

// Comprehensive product data validation
export function validateProductData(data: any): ProductFormData {
  const errors: string[] = [];
  
  try {
    // Validate name
    if (!data.name || typeof data.name !== 'string') {
      errors.push('Product name is required');
    }
    const name = sanitizeString(data.name, 100);
    if (name.length < 2) {
      errors.push('Product name must be at least 2 characters');
    }
    
    // Validate price
    let price: number;
    try {
      price = validateNumber(data.price, 0.01, 99999.99);
    } catch (error) {
      errors.push('Price must be a valid number between 0.01 and 99999.99');
    }
    
    // Validate category
    let category: string;
    try {
      category = validateCategory(data.category);
    } catch (error) {
      errors.push('Invalid category');
    }
    
    // Validate optional fields
    const subcategory = data.subcategory ? sanitizeString(data.subcategory, 50) : '';
    const gemColor = data.gemColor ? sanitizeString(data.gemColor, 30) : '';
    const description = data.description ? sanitizeString(data.description, 1000) : '';
    
    // Validate stock
    let stock: number;
    try {
      stock = validateNumber(data.stock, 0, 999999);
    } catch (error) {
      errors.push('Stock must be a valid number between 0 and 999999');
    }
    
    // Validate low stock threshold
    let lowStockThreshold: number;
    try {
      lowStockThreshold = validateNumber(data.lowStockThreshold, 0, 1000);
    } catch (error) {
      errors.push('Low stock threshold must be a valid number between 0 and 1000');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    return {
      name: name!,
      price: price!,
      category: category!,
      subcategory,
      gemColor,
      description,
      featured: Boolean(data.featured),
      new: Boolean(data.new),
      bestseller: Boolean(data.bestseller),
      stock: stock!,
      lowStockThreshold: lowStockThreshold!,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true
    };
    
  } catch (error) {
    throw new Error(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
