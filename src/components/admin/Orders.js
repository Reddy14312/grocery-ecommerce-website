import React, { Component } from 'react';
import AdminLayout from './AdminLayout';
import { adminService } from '../../services/adminService';

export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
      error: null,
      selectedOrder: null,
      showDetailModal: false,
      statusFilter: 'all'
    };
  }

  async componentDidMount() {
    await this.loadOrders();
  }

  loadOrders = async () => {
    try {
      this.setState({ loading: true, error: null });
      const orders = await adminService.getAllOrders();
      this.setState({ orders, loading: false });
    } catch (error) {
      console.error('Error loading orders:', error);
      this.setState({ error: 'Failed to load orders', loading: false });
    }
  };

  handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      await this.loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status: ' + error.message);
    }
  };

  handleViewDetails = (order) => {
    this.setState({ selectedOrder: order, showDetailModal: true });
  };

  closeModal = () => {
    this.setState({ showDetailModal: false });
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

  getFilteredOrders = () => {
    const { orders, statusFilter } = this.state;
    if (statusFilter === 'all') return orders;
    return orders.filter(order => order.status === statusFilter);
  };

  render() {
    const { loading, error, showDetailModal, selectedOrder, statusFilter } = this.state;
    const filteredOrders = this.getFilteredOrders();

    return (
      <AdminLayout>
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Orders</h2>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => this.setState({ statusFilter: e.target.value })}
                className="admin-form-select"
                style={{ width: 'auto', display: 'inline-block' }}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {loading && <div>Loading orders...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <>
              {filteredOrders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id.substring(0, 8)}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>{order.order_items?.length || 0} items</td>
                        <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) => this.handleUpdateStatus(order.id, e.target.value)}
                            className={`badge ${this.getStatusBadgeClass(order.status)}`}
                            style={{ border: 'none', cursor: 'pointer' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() => this.handleViewDetails(order)}
                            className="admin-btn admin-btn-primary"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>

        {showDetailModal && selectedOrder && (
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
              maxWidth: '700px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h3>Order Details</h3>

              <div style={{ marginBottom: '20px' }}>
                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`badge ${this.getStatusBadgeClass(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </p>
                <p><strong>Total:</strong> ${parseFloat(selectedOrder.total_amount).toFixed(2)}</p>
              </div>

              <h4>Items</h4>
              <table className="admin-table" style={{ marginBottom: '20px' }}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.order_items?.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {item.product?.image_url && (
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="admin-product-image"
                              onError={(e) => {
                                e.target.src = '/images/of.png';
                              }}
                            />
                          )}
                          <span>{item.product?.name || 'Product Unavailable'}</span>
                        </div>
                      </td>
                      <td>{item.quantity}</td>
                      <td>${parseFloat(item.price_at_purchase).toFixed(2)}</td>
                      <td>${(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {selectedOrder.shipping_address && Object.keys(selectedOrder.shipping_address).length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4>Shipping Address</h4>
                  <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                    {JSON.stringify(selectedOrder.shipping_address, null, 2)}
                  </pre>
                </div>
              )}

              {selectedOrder.notes && (
                <div style={{ marginBottom: '20px' }}>
                  <h4>Notes</h4>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={this.closeModal} className="admin-btn admin-btn-primary">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    );
  }
}
