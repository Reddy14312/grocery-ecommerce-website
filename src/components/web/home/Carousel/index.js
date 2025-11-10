import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './carousel.css';

export default class Carousel extends Component {
    render() {
        var settings = {
            dots: true,
            infinite: true,
            autoplay: true,
            speed: 1000,
            autoplaySpeed: 5000,
            slidesToShow: 1,
            slidesToScroll: 1,
            fade: true,
            pauseOnHover: true
        };
        return (
            <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="hero-carousel-container">
                        <Slider {...settings}>
                            <div className="hero-slide">
                                <img src="images/super3.jpg" alt="Fresh Groceries"/>
                                <div className="hero-overlay">
                                    <div className="hero-content">
                                        <h2>Fresh Groceries Delivered</h2>
                                        <p>Get the best quality products at your doorstep</p>
                                        <Link to="/kitchen" className="hero-cta">Shop Now</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="hero-slide">
                                <img src="images/super2.jpg" alt="Daily Essentials"/>
                                <div className="hero-overlay">
                                    <div className="hero-content">
                                        <h2>Daily Essentials</h2>
                                        <p>Everything you need for your home</p>
                                        <Link to="/kitchen" className="hero-cta">Explore More</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="hero-slide">
                                <img src="images/super4.jpg" alt="Special Offers"/>
                                <div className="hero-overlay">
                                    <div className="hero-content">
                                        <h2>Special Offers</h2>
                                        <p>Save big on your favorite products</p>
                                        <Link to="/kitchen" className="hero-cta">View Deals</Link>
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                </Grid>
            </Grid>
        )
    }
}
