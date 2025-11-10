import { supabase } from '../lib/supabase';

const getSessionId = () => {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

export const cartService = {
  async getCartItems() {
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from('cart_items')
      .select(`
        *,
        product:products(id, name, slug, price, image_url, stock_quantity)
      `);

    if (user) {
      query = query.eq('user_id', user.id);
    } else {
      const sessionId = getSessionId();
      query = query.eq('session_id', sessionId).is('user_id', null);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async addToCart(productId, quantity = 1) {
    const { data: { user } } = await supabase.auth.getUser();

    const cartData = {
      product_id: productId,
      quantity: quantity,
      user_id: user?.id || null,
      session_id: user ? null : getSessionId()
    };

    const existingItems = await this.getCartItems();
    const existingItem = existingItems.find(item => item.product_id === productId);

    if (existingItem) {
      return await this.updateCartItem(existingItem.id, existingItem.quantity + quantity);
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert([cartData])
      .select(`
        *,
        product:products(id, name, slug, price, image_url, stock_quantity)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async updateCartItem(cartItemId, quantity) {
    if (quantity <= 0) {
      return await this.removeFromCart(cartItemId);
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('id', cartItemId)
      .select(`
        *,
        product:products(id, name, slug, price, image_url, stock_quantity)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async removeFromCart(cartItemId) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;
    return true;
  },

  async clearCart() {
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase.from('cart_items').delete();

    if (user) {
      query = query.eq('user_id', user.id);
    } else {
      const sessionId = getSessionId();
      query = query.eq('session_id', sessionId).is('user_id', null);
    }

    const { error } = await query;
    if (error) throw error;
    return true;
  },

  async mergeGuestCart() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) return;

    const { data: guestItems } = await supabase
      .from('cart_items')
      .select('*')
      .eq('session_id', sessionId)
      .is('user_id', null);

    if (!guestItems || guestItems.length === 0) return;

    for (const item of guestItems) {
      await supabase
        .from('cart_items')
        .update({ user_id: user.id, session_id: null })
        .eq('id', item.id);
    }

    localStorage.removeItem('cart_session_id');
  }
};
