import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../../services/productService';

export default class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      loading: true,
      error: null,
      selectedImage: null,
      relatedProducts: []
    };
  }

  async componentDidMount() {
    await this.loadProduct();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.match.params.slug !== this.props.match.params.slug) {
      await this.loadProduct();
    }
  }

  loadProduct = async () => {
    try {
      this.setState({ loading: true, error: null });
      const slug = this.props.match.params.slug;
      const product = await productService.getProductBySlug(slug);

      if (!product) {
        this.setState({
          error: 'Product not found',
          loading: false
        });
        return;
      }

      const selectedImage = product.images && product.images.length > 0
        ? product.images.sort((a, b) => a.display_order - b.display_order)[0].image_url
        : product.image_url;

      let relatedProducts = [];
      if (product.category) {
        const categoryProducts = await productService.getProductsByCategory(product.category.slug);
        relatedProducts = categoryProducts
          .filter(p => p.id !== product.id)
          .slice(0, 8);
      }

      this.setState({
        product,
        selectedImage,
        relatedProducts,
        loading: false
      });
    } catch (error) {
      console.error('Error loading product:', error);
      this.setState({
        error: 'Failed to load product. Please try again later.',
        loading: false
      });
    }
  };

  handleImageSelect = (imageUrl) => {
    this.setState({ selectedImage: imageUrl });
  };

  handleAddToCart = () => {
    console.log('Add to cart:', this.state.product);
  };

  render() {
    const { product, loading, error, selectedImage, relatedProducts } = this.state;

    if (loading) {
      return (
        <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
          <div className="spinner" style={{ fontSize: '18px' }}>Loading product...</div>
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

    if (!product) {
      return null;
    }

    const isOutOfStock = product.stock_quantity === 0;
    const stockStatus = isOutOfStock ? 'Out of Stock' : `${product.stock_quantity} available`;

    return (
      <div>
        <div className="banner-top">
          <div className="container">
            <h3>Product Details</h3>
            <h4>
              <Link to="/">Home</Link>
              <label>/</label>
              {product.category && (
                <>
                  <Link to={`/category/${product.category.slug}`}>{product.category.name}</Link>
                  <label>/</label>
                </>
              )}
              {product.name}
            </h4>
            <div className="clearfix"></div>
          </div>
        </div>

        <div className="single">
          <div className="container">
            <div className="single-top-main">
              <div className="col-md-5 single-top">
                <div className="single-w3agile">
                  <div id="picture-frame" style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className="img-responsive"
                      onError={(e) => {
                        e.target.src = '/images/of.png';
                      }}
                    />
                  </div>

                  {product.images && product.images.length > 0 && (
                    <div className="product-thumbnails" style={{
                      display: 'flex',
                      gap: '10px',
                      marginTop: '15px',
                      flexWrap: 'wrap'
                    }}>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        onClick={() => this.handleImageSelect(product.image_url)}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: selectedImage === product.image_url ? '2px solid #d9534f' : '2px solid #ddd',
                          borderRadius: '4px'
                        }}
                        onError={(e) => {
                          e.target.src = '/images/of.png';
                        }}
                      />
                      {product.images.sort((a, b) => a.display_order - b.display_order).map((img) => (
                        <img
                          key={img.id}
                          src={img.image_url}
                          alt={product.name}
                          onClick={() => this.handleImageSelect(img.image_url)}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            border: selectedImage === img.image_url ? '2px solid #d9534f' : '2px solid #ddd',
                            borderRadius: '4px'
                          }}
                          onError={(e) => {
                            e.target.src = '/images/of.png';
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-7 single-top-left">
                <div className="single-right">
                  <h3>{product.name}</h3>
                  <div className="pr-single">
                    <p className="reduced">${parseFloat(product.price).toFixed(2)}</p>
                  </div>

                  <div className="stock-status" style={{
                    padding: '10px',
                    marginBottom: '15px',
                    backgroundColor: isOutOfStock ? '#f8d7da' : '#d4edda',
                    border: `1px solid ${isOutOfStock ? '#f5c6cb' : '#c3e6cb'}`,
                    borderRadius: '4px',
                    color: isOutOfStock ? '#721c24' : '#155724'
                  }}>
                    <strong>Stock Status:</strong> {stockStatus}
                  </div>

                  <div className="block block-w3">
                    <div className="starbox small ghosting">
                      <div className="positioner">
                        <div className="stars">
                          <div className="ghost" style={{ display: 'none', width: '42.5px' }} />
                          <div className="colorbar" style={{ width: '42.5px' }} />
                          <div className="star_holder">
                            <div className="star star-0" />
                            <div className="star star-1" />
                            <div className="star star-2" />
                            <div className="star star-3" />
                            <div className="star star-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="in-pa">{product.description || 'No description available.'}</p>

                  {product.category && (
                    <p style={{ marginTop: '15px' }}>
                      <strong>Category:</strong>{' '}
                      <Link to={`/category/${product.category.slug}`}>
                        {product.category.name}
                      </Link>
                    </p>
                  )}

                  <ul className="social-top">
                    <li>
                      <a href="/" className="icon facebook">
                        <i className="fa fa-facebook" aria-hidden="true" />
                        <span />
                      </a>
                    </li>
                    <li>
                      <a href="/" className="icon twitter">
                        <i className="fa fa-twitter" aria-hidden="true" />
                        <span />
                      </a>
                    </li>
                    <li>
                      <a href="/" className="icon pinterest">
                        <i className="fa fa-pinterest-p" aria-hidden="true" />
                        <span />
                      </a>
                    </li>
                  </ul>

                  <div className="add add-3">
                    <button
                      className="btn btn-danger my-cart-btn my-cart-b"
                      onClick={this.handleAddToCart}
                      disabled={isOutOfStock}
                      style={{
                        opacity: isOutOfStock ? 0.6 : 1,
                        cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                  <div className="clearfix"></div>
                </div>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="content-top offer-w3agile">
            <div className="container">
              <div className="spec">
                <h3>Related Products</h3>
                <div className="ser-t">
                  <b />
                  <span><i /></span>
                  <b className="line" />
                </div>
              </div>
              <div className="con-w3l wthree-of">
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="col-md-3 pro-1">
                    <div className="col-m">
                      <Link to={`/product/${relatedProduct.slug}`} className="offer-img">
                        <img
                          src={relatedProduct.image_url}
                          className="img-responsive"
                          alt={relatedProduct.name}
                          onError={(e) => {
                            e.target.src = '/images/of.png';
                          }}
                        />
                      </Link>
                      <div className="mid-1">
                        <div className="women">
                          <h6>
                            <Link to={`/product/${relatedProduct.slug}`}>{relatedProduct.name}</Link>
                          </h6>
                        </div>
                        <div className="mid-2">
                          <p>
                            <em className="item_price">${parseFloat(relatedProduct.price).toFixed(2)}</em>
                          </p>
                          <div className="block">
                            <div className="starbox small ghosting"></div>
                          </div>
                          <div className="clearfix" />
                        </div>
                        <div className="add">
                          <Link to={`/product/${relatedProduct.slug}`} className="btn btn-danger">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="clearfix" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
