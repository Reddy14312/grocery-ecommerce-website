import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { adminService } from '../../services/adminService';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: {
        totalProducts: 0,
        totalOrders: 0,
        totalCategories: 0,
        totalRevenue: 0
      },
      recentOrders: [],
      lowStockProducts: [],
      loading: true,
      error: null
    };
  }

  async componentDidMount() {
    await this.loadDashboardData();
  }

  loadDashboardData = async () => {
    try {
      this.setState({ loading: true, error: null });

      const [stats, recentOrders, lowStockProducts] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRecentOrders(5),
        adminService.getLowStockProducts(10)
      ]);

      this.setState({
        stats,
        recentOrders,
        lowStockProducts,
        loading: false
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.setState({
        error: 'Failed to load dashboard data',
        loading: false
      });
    }
  };

  getStatusBadgeClass = (status) => {
    const statusMap = {
      pending: 'badge-warning',
      processing: 'badge-info',
      shipped: 'badge-info',
      delivered: 'badge-success',
      cancelled: 'badge-danger'
    };
    return statusMap[status] || 'badge-secondary';
  };

  render() {
    const { stats, recentOrders, lowStockProducts, loading, error } = this.state;

    return (
      <AdminLayout>
        <h1>Dashboard</h1>

        {loading && (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <div style={{ fontSize: '18px' }}>Loading dashboard...</div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {!loading && !error && (
          <>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-label">Total Products</div>
                <h2 className="admin-stat-value">{stats.totalProducts}</h2>
              </div>

              <div className="admin-stat-card success">
                <div className="admin-stat-label">Total Orders</div>
                <h2 className="admin-stat-value">{stats.totalOrders}</h2>
              </div>

              <div className="admin-stat-card warning">
                <div className="admin-stat-label">Categories</div>
                <h2 className="admin-stat-value">{stats.totalCategories}</h2>
              </div>

              <div className="admin-stat-card danger">
                <div className="admin-stat-label">Total Revenue</div>
                <h2 className="admin-stat-value">${stats.totalRevenue.toFixed(2)}</h2>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Recent Orders</h3>
                <Link to="/admin/orders" className="admin-btn admin-btn-primary">
                  View All
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <p>No orders yet.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id.substring(0, 8)}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                        <td>
                          <span className={`badge ${this.getStatusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <Link to={`/admin/orders`} className="admin-btn admin-btn-primary">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Low Stock Products</h3>
                <Link to="/admin/products" className="admin-btn admin-btn-warning">
                  Manage Stock
                </Link>
              </div>

              {lowStockProducts.length === 0 ? (
                <p>All products are well stocked.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Stock</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="admin-product-image"
                              onError={(e) => {
                                e.target.src = '/images/of.png';
                              }}
                            />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${product.stock_quantity === 0 ? 'badge-danger' : 'badge-warning'}`}>
                            {product.stock_quantity} left
                          </span>
                        </td>
                        <td>${parseFloat(product.price).toFixed(2)}</td>
                        <td>
                          <Link to={`/admin/products`} className="admin-btn admin-btn-primary">
                            Update
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </AdminLayout>
    );
  }
}
