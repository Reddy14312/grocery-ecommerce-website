import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { adminService } from '../../services/adminService';

class AdminRoute extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isAdmin: false
    };
  }

  async componentDidMount() {
    await this.checkAdminStatus();
  }

  checkAdminStatus = async () => {
    try {
      const { isAuthenticated } = this.context;

      if (!isAuthenticated) {
        this.setState({ loading: false, isAdmin: false });
        return;
      }

      const isAdmin = await adminService.checkIsAdmin();
      this.setState({ loading: false, isAdmin });
    } catch (error) {
      console.error('Error checking admin status:', error);
      this.setState({ loading: false, isAdmin: false });
    }
  };

  render() {
    const { component: Component, ...rest } = this.props;
    const { loading, isAdmin } = this.state;
    const { isAuthenticated } = this.context;

    if (loading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          <div style={{ fontSize: '18px' }}>Loading...</div>
        </div>
      );
    }

    return (
      <Route
        {...rest}
        render={(props) => {
          if (!isAuthenticated) {
            return <Redirect to="/login" />;
          }

          if (!isAdmin) {
            return (
              <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
                <h2>Access Denied</h2>
                <p>You do not have permission to access this page.</p>
                <p>Admin privileges are required.</p>
                <a href="/" className="btn btn-primary">Go to Home</a>
              </div>
            );
          }

          return <Component {...props} />;
        }}
      />
    );
  }
}

export default AdminRoute;
