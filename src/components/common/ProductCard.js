import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, showOffer = false }) => {
  const stockStatus = product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock';
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="col-md-3 pro-1">
      <div className="col-m">
        <Link
          to={`/product/${product.slug}`}
          className="offer-img"
        >
          <img
            src={product.image_url}
            className="img-responsive"
            alt={product.name}
            onError={(e) => {
              e.target.src = '/images/of.png';
            }}
          />
          {showOffer && (
            <div className="offer">
              <p><span>Offer</span></p>
            </div>
          )}
        </Link>
        <div className="mid-1">
          <div className="women">
            <h6>
              <Link to={`/product/${product.slug}`}>{product.name}</Link>
            </h6>
          </div>
          <div className="mid-2">
            <p>
              <em className="item_price">${parseFloat(product.price).toFixed(2)}</em>
            </p>
            <div className="stock-info" style={{
              fontSize: '12px',
              color: isOutOfStock ? '#d9534f' : '#5cb85c',
              marginBottom: '8px'
            }}>
              {stockStatus} ({product.stock_quantity} available)
            </div>
            <div className="block">
              <div className="starbox small ghosting"></div>
            </div>
            <div className="clearfix" />
          </div>
          <div className="add">
            <button
              className="btn btn-danger my-cart-btn my-cart-b"
              onClick={() => onAddToCart && onAddToCart(product)}
              disabled={isOutOfStock}
              style={{
                opacity: isOutOfStock ? 0.6 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer'
              }}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
