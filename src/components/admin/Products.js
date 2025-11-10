import React, { Component } from 'react';
import AdminLayout from './AdminLayout';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { adminService } from '../../services/adminService';

export default class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      categories: [],
      loading: true,
      error: null,
      showModal: false,
      editingProduct: null,
      formData: {
        name: '',
        slug: '',
        description: '',
        price: '',
        image_url: '',
        stock_quantity: '',
        category_id: '',
        is_active: true
      }
    };
  }

  async componentDidMount() {
    await this.loadData();
  }

  loadData = async () => {
    try {
      this.setState({ loading: true, error: null });
      const [products, categories] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories()
      ]);
      this.setState({ products, categories, loading: false });
    } catch (error) {
      console.error('Error loading products:', error);
      this.setState({ error: 'Failed to load products', loading: false });
    }
  };

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      formData: {
        ...this.state.formData,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  };

  handleAddProduct = () => {
    this.setState({
      showModal: true,
      editingProduct: null,
      formData: {
        name: '',
        slug: '',
        description: '',
        price: '',
        image_url: '',
        stock_quantity: '',
        category_id: '',
        is_active: true
      }
    });
  };

  handleEditProduct = (product) => {
    this.setState({
      showModal: true,
      editingProduct: product,
      formData: {
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: product.price,
        image_url: product.image_url,
        stock_quantity: product.stock_quantity,
        category_id: product.category_id || '',
        is_active: product.is_active
      }
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { editingProduct, formData } = this.state;

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity)
      };

      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, productData);
      } else {
        await adminService.createProduct(productData);
      }

      this.setState({ showModal: false });
      await this.loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product: ' + error.message);
    }
  };

  handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await adminService.deleteProduct(productId);
      await this.loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product: ' + error.message);
    }
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { products, categories, loading, error, showModal, editingProduct, formData } = this.state;

    return (
      <AdminLayout>
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Products</h2>
            <button onClick={this.handleAddProduct} className="admin-btn admin-btn-success">
              <i className="fa fa-plus"></i> Add Product
            </button>
          </div>

          {loading && <div>Loading products...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="admin-product-image"
                        onError={(e) => {
                          e.target.src = '/images/of.png';
                        }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category?.name || 'N/A'}</td>
                    <td>${parseFloat(product.price).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${product.stock_quantity === 0 ? 'badge-danger' : product.stock_quantity < 10 ? 'badge-warning' : 'badge-success'}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${product.is_active ? 'badge-success' : 'badge-secondary'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => this.handleEditProduct(product)}
                        className="admin-btn admin-btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => this.handleDeleteProduct(product.id)}
                        className="admin-btn admin-btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>

              <form onSubmit={this.handleSubmit}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={this.handleInputChange}
                    className="admin-form-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={this.handleInputChange}
                    className="admin-form-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={this.handleInputChange}
                    className="admin-form-select"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={this.handleInputChange}
                    className="admin-form-textarea"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={this.handleInputChange}
                    className="admin-form-input"
                    step="0.01"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={this.handleInputChange}
                    className="admin-form-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Image URL *</label>
                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={this.handleInputChange}
                    className="admin-form-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={this.handleInputChange}
                    />
                    Active
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={this.closeModal} className="admin-btn">
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-success">
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    );
  }
}
