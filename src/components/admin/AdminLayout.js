import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './admin.css';

export default class AdminLayout extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: true
    };
  }

  toggleSidebar = () => {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  };

  handleLogout = async () => {
    const { signOut } = this.context;
    await signOut();
  };

  render() {
    const { sidebarOpen } = this.state;
    const { children } = this.props;

    return (
      <div className="admin-layout">
        <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="admin-sidebar-header">
            <h2>Admin Panel</h2>
          </div>
          <nav className="admin-nav">
            <Link to="/admin" className="admin-nav-item">
              <i className="fa fa-dashboard"></i>
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/products" className="admin-nav-item">
              <i className="fa fa-shopping-bag"></i>
              <span>Products</span>
            </Link>
            <Link to="/admin/categories" className="admin-nav-item">
              <i className="fa fa-list"></i>
              <span>Categories</span>
            </Link>
            <Link to="/admin/orders" className="admin-nav-item">
              <i className="fa fa-shopping-cart"></i>
              <span>Orders</span>
            </Link>
            <Link to="/" className="admin-nav-item">
              <i className="fa fa-globe"></i>
              <span>View Store</span>
            </Link>
            <button onClick={this.handleLogout} className="admin-nav-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer' }}>
              <i className="fa fa-sign-out"></i>
              <span>Logout</span>
            </button>
          </nav>
        </div>

        <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="admin-header">
            <button className="sidebar-toggle" onClick={this.toggleSidebar}>
              <i className={`fa fa-${sidebarOpen ? 'times' : 'bars'}`}></i>
            </button>
            <div className="admin-header-right">
              <span className="admin-user">
                {this.context.user?.user_metadata?.name || this.context.user?.email}
              </span>
            </div>
          </div>

          <div className="admin-content">
            {children}
          </div>
        </div>
      </div>
    );
  }
}
