import React, { Component } from 'react';
import AdminLayout from './AdminLayout';
import { categoryService } from '../../services/categoryService';
import { adminService } from '../../services/adminService';

export default class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      loading: true,
      error: null,
      showModal: false,
      editingCategory: null,
      formData: {
        name: '',
        slug: '',
        description: '',
        image_url: ''
      }
    };
  }

  async componentDidMount() {
    await this.loadCategories();
  }

  loadCategories = async () => {
    try {
      this.setState({ loading: true, error: null });
      const categories = await categoryService.getAllCategories();
      this.setState({ categories, loading: false });
    } catch (error) {
      console.error('Error loading categories:', error);
      this.setState({ error: 'Failed to load categories', loading: false });
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value
      }
    });
  };

  handleAddCategory = () => {
    this.setState({
      showModal: true,
      editingCategory: null,
      formData: {
        name: '',
        slug: '',
        description: '',
        image_url: ''
      }
    });
  };

  handleEditCategory = (category) => {
    this.setState({
      showModal: true,
      editingCategory: category,
      formData: {
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image_url: category.image_url || ''
      }
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { editingCategory, formData } = this.state;

      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, formData);
      } else {
        await adminService.createCategory(formData);
      }

      this.setState({ showModal: false });
      await this.loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category: ' + error.message);
    }
  };

  handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This will affect all products in this category.')) {
      return;
    }

    try {
      await adminService.deleteCategory(categoryId);
      await this.loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category: ' + error.message);
    }
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { categories, loading, error, showModal, editingCategory, formData } = this.state;

    return (
      <AdminLayout>
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Categories</h2>
            <button onClick={this.handleAddCategory} className="admin-btn admin-btn-success">
              <i className="fa fa-plus"></i> Add Category
            </button>
          </div>

          {loading && <div>Loading categories...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      {category.image_url && (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="admin-product-image"
                          onError={(e) => {
                            e.target.src = '/images/of.png';
                          }}
                        />
                      )}
                    </td>
                    <td>{category.name}</td>
                    <td>{category.slug}</td>
                    <td>{category.description || 'N/A'}</td>
                    <td>
                      <button
                        onClick={() => this.handleEditCategory(category)}
                        className="admin-btn admin-btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => this.handleDeleteCategory(category.id)}
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
              <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>

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
                  <label className="admin-form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={this.handleInputChange}
                    className="admin-form-textarea"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Image URL</label>
                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={this.handleInputChange}
                    className="admin-form-input"
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={this.closeModal} className="admin-btn">
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-success">
                    {editingCategory ? 'Update' : 'Create'}
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
