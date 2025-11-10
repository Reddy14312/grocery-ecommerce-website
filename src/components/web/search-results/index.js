import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../../services/productService';
import ProductCard from '../../common/ProductCard';

export default class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      error: null,
      searchQuery: ''
    };
  }

  async componentDidMount() {
    await this.performSearch();
  }

  async componentDidUpdate(prevProps) {
    const currentQuery = new URLSearchParams(this.props.location.search).get('q');
    const prevQuery = new URLSearchParams(prevProps.location.search).get('q');

    if (currentQuery !== prevQuery) {
      await this.performSearch();
    }
  }

  performSearch = async () => {
    try {
      this.setState({ loading: true, error: null });

      const query = new URLSearchParams(this.props.location.search).get('q');

      if (!query) {
        this.setState({
          products: [],
          searchQuery: '',
          loading: false
        });
        return;
      }

      this.setState({ searchQuery: query });
      const products = await productService.searchProducts(query);
      this.setState({ products, loading: false });
    } catch (error) {
      console.error('Error searching products:', error);
      this.setState({
        error: 'Failed to search products. Please try again later.',
        loading: false
      });
    }
  };

  handleAddToCart = (product) => {
    console.log('Add to cart:', product);
  };

  render() {
    const { products, loading, error, searchQuery } = this.state;

    return (
      <div>
        <div className="banner-top">
          <div className="container">
            <h3>Search Results</h3>
            <h4>
              <Link to="/">Home</Link>
              <label>/</label>
              Search
              {searchQuery && ` for "${searchQuery}"`}
            </h4>
            <div className="clearfix"></div>
          </div>
        </div>

        <div className="product">
          <div className="container">
            <div className="spec">
              {searchQuery && <h3>Results for "{searchQuery}"</h3>}
              <div className="ser-t">
                <b />
                <span><i /></span>
                <b className="line" />
              </div>
            </div>

            {loading && (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <div className="spinner" style={{ fontSize: '18px' }}>Searching products...</div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger" style={{ margin: '20px 0' }}>
                {error}
              </div>
            )}

            {!loading && !error && !searchQuery && (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <p>Please enter a search query to find products.</p>
                <Link to="/" className="btn btn-primary">Go to Home</Link>
              </div>
            )}

            {!loading && !error && searchQuery && products.length === 0 && (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <h4>No products found for "{searchQuery}"</h4>
                <p>Try searching with different keywords.</p>
                <Link to="/" className="btn btn-primary">Go to Home</Link>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <>
                <div style={{ marginBottom: '20px', fontSize: '16px' }}>
                  Found {products.length} product{products.length !== 1 ? 's' : ''}
                </div>
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
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}
