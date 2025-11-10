import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { productService } from '../../../../../services/productService';

export default class Sliderproduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            products: [],
            loading: true,
            error: null
        };
    }

    async componentDidMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
        await this.loadProducts();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    loadProducts = async () => {
        try {
            const products = await productService.getAllProducts();
            this.setState({ products: products.slice(0, 8), loading: false });
        } catch (error) {
            console.error('Error loading products:', error);
            this.setState({ error: 'Failed to load products', loading: false });
        }
    };

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    };

    handleAddToCart = (product) => {
        if (this.props.state && this.props.state.addToCart) {
            this.props.state.addToCart(product.slug);
        }
    };

    renderProductCard = (product) => {
        const isOutOfStock = product.stock_quantity === 0;

        return (
            <div key={product.id} className="col-md-3 m-wthree">
                <div className="col-m">
                    <Link to={`/product/${product.slug}`} className="offer-img">
                        <img
                            src={product.image_url}
                            className="img-responsive"
                            alt={product.name}
                            onError={(e) => {
                                e.target.src = '/images/of.png';
                            }}
                        />
                        <div className="offer">
                            <p><span>Offer</span></p>
                        </div>
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
                            <div className="block">
                                <div className="starbox small ghosting"></div>
                            </div>
                            <div className="clearfix" />
                        </div>
                        <div className="add">
                            <button
                                className="btn btn-danger my-cart-btn my-cart-b"
                                onClick={() => this.handleAddToCart(product)}
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

    render() {
        const { products, loading } = this.state;
        const { width } = this.state;
        const isMobile = width <= 800;

        if (loading) {
            return (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <div style={{ fontSize: '16px' }}>Loading products...</div>
                </div>
            );
        }

        if (products.length === 0) {
            return null;
        }

        const settings = {
            dots: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 2
        };

        const settingsMobile = {
            dots: true,
            infinite: true,
            autoplay: true,
            speed: 2000,
            autoplaySpeed: 2000,
            slidesToShow: 2,
            slidesToScroll: 1
        };

        return (
            <div>
                <Slider {...(isMobile ? settingsMobile : settings)}>
                    {products.map((product) => this.renderProductCard(product))}
                </Slider>
            </div>
        );
    }
}
