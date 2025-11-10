import {
    ADD_TO_CART,
    GET_NUMBERS_BASKET,
    LOAD_PRODUCTS,
    LOAD_PRODUCTS_SUCCESS,
    LOAD_PRODUCTS_FAILURE,
    LOAD_CART,
    LOAD_CART_SUCCESS,
    LOAD_CART_FAILURE,
    CLEAR_CART
} from './types';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';

export const addToCart = (productName)=> {
    return(dispatch)=> {
        // console.log("Adding basket of item");
        dispatch({
            type: ADD_TO_CART,
            payload: productName
        });
    }
}

export const getCartNumbers = ()=> {
    return(dispatch)=> {
        dispatch({
            type: GET_NUMBERS_BASKET,
        });
    }
}

export const loadProducts = () => {
    return async (dispatch) => {
        dispatch({ type: LOAD_PRODUCTS });
        try {
            const products = await productService.getAllProducts();
            dispatch({
                type: LOAD_PRODUCTS_SUCCESS,
                payload: products
            });
        } catch (error) {
            dispatch({
                type: LOAD_PRODUCTS_FAILURE,
                payload: error.message
            });
        }
    }
}

export const loadCart = () => {
    return async (dispatch) => {
        dispatch({ type: LOAD_CART });
        try {
            const cartItems = await cartService.getCartItems();
            dispatch({
                type: LOAD_CART_SUCCESS,
                payload: cartItems
            });
        } catch (error) {
            dispatch({
                type: LOAD_CART_FAILURE,
                payload: error.message
            });
        }
    }
}

export const addToCartDB = (productId, quantity = 1) => {
    return async (dispatch) => {
        try {
            const cartItem = await cartService.addToCart(productId, quantity);
            dispatch(loadCart());
            return cartItem;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }
}

export const updateCartItemDB = (cartItemId, quantity) => {
    return async (dispatch) => {
        try {
            await cartService.updateCartItem(cartItemId, quantity);
            dispatch(loadCart());
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    }
}

export const removeFromCartDB = (cartItemId) => {
    return async (dispatch) => {
        try {
            await cartService.removeFromCart(cartItemId);
            dispatch(loadCart());
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    }
}

export const clearCartDB = () => {
    return async (dispatch) => {
        try {
            await cartService.clearCart();
            dispatch({ type: CLEAR_CART });
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }
}