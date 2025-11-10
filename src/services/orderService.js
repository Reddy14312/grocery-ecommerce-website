import { supabase } from '../lib/supabase';
import { cartService } from './cartService';

export const orderService = {
  async createOrder(orderData) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User must be authenticated to create an order');
    }

    const cartItems = await cartService.getCartItems();
    if (!cartItems || cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    const order = {
      user_id: user.id,
      status: 'pending',
      total_amount: totalAmount,
      shipping_address: orderData.shippingAddress,
      contact_info: orderData.contactInfo,
      notes: orderData.notes || ''
    };

    const { data: createdOrder, error: orderError } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = cartItems.map(item => ({
      order_id: createdOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.product.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    await cartService.clearCart();

    return createdOrder;
  },

  async getOrders() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User must be authenticated to view orders');
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(id, name, slug, image_url)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOrderById(orderId) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User must be authenticated to view orders');
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(id, name, slug, image_url, description)
        )
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};
