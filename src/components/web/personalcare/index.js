import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../../services/productService';
import ProductCard from '../../common/ProductCard';

export default class Care extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      error: null
    };
  }

  async componentDidMount() {
    await this.loadProducts();
  }

  loadProducts = async () => {
    try {
      this.setState({ loading: true, error: null });
      const products = await productService.getProductsByCategory('personal-care');
      this.setState({ products, loading: false });
    } catch (error) {
      console.error('Error loading personal care products:', error);
      this.setState({
        error: 'Failed to load products. Please try again later.',
        loading: false
      });
    }
  };

  handleAddToCart = (product) => {
    console.log('Add to cart:', product);
  };

  render() {
    const { products, loading, error } = this.state;

    return (
      <div>
        <div id="myCarousel" className="carousel slide" data-ride="carousel">
          <ol className="carousel-indicators">
            <li data-target="#myCarousel" data-slide-to={0} className="active" />
            <li data-target="#myCarousel" data-slide-to={1} />
            <li data-target="#myCarousel" data-slide-to={2} />
          </ol>
          <div className="carousel-inner" role="listbox">
            <div className="item active">
              <Link to="/">
                <img className="first-slide" src="/images/ba1.jpg" alt="First slide" />
              </Link>
            </div>
            <div className="item">
              <Link to="/">
                <img className="second-slide" src="/images/ba.jpg" alt="Second slide" />
              </Link>
            </div>
            <div className="item">
              <Link to="/">
                <img className="third-slide" src="/images/ba2.jpg" alt="Third slide" />
              </Link>
            </div>
          </div>
        </div>

        <div className="kic-top">
          <div className="container">
            <div className="kic">
              <h3>Personal Care</h3>
            </div>
          </div>
        </div>

        <div className="product">
          <div className="container">
            <div className="spec">
              <h3>Products</h3>
              <div className="ser-t">
                <b />
                <span><i /></span>
                <b className="line" />
              </div>
            </div>

            {loading && (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <div className="spinner" style={{ fontSize: '18px' }}>Loading products...</div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger" style={{ margin: '20px 0' }}>
                {error}
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <p>No products available in this category.</p>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <div className="con-w3l agileinf">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={this.handleAddToCart}
                    showOffer={false}
                  />
                ))}
                <div className="clearfix" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
