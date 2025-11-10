import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService';
import ProductCard from '../../common/ProductCard';

export default class CategoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      category: null,
      loading: true,
      error: null
    };
  }

  async componentDidMount() {
    await this.loadCategoryAndProducts();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.match.params.slug !== this.props.match.params.slug) {
      await this.loadCategoryAndProducts();
    }
  }

  loadCategoryAndProducts = async () => {
    try {
      this.setState({ loading: true, error: null });
      const slug = this.props.match.params.slug;

      const category = await categoryService.getCategoryBySlug(slug);
      if (!category) {
        this.setState({
          error: 'Category not found',
          loading: false
        });
        return;
      }

      const products = await productService.getProductsByCategory(slug);
      this.setState({ products, category, loading: false });
    } catch (error) {
      console.error('Error loading category products:', error);
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
    const { products, category, loading, error } = this.state;

    if (loading) {
      return (
        <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
          <div className="spinner" style={{ fontSize: '18px' }}>Loading...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
          <div className="alert alert-danger">{error}</div>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      );
    }

    return (
      <div>
        <div className="banner-top">
          <div className="container">
            <h3>{category?.name || 'Products'}</h3>
            <h4>
              <Link to="/">Home</Link>
              <label>/</label>
              {category?.name}
            </h4>
            <div className="clearfix"></div>
          </div>
        </div>

        <div className="product">
          <div className="container">
            <div className="spec">
              <h3>{category?.name}</h3>
              <div className="ser-t">
                <b />
                <span><i /></span>
                <b className="line" />
              </div>
            </div>

            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <p>No products available in this category.</p>
              </div>
            ) : (
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
