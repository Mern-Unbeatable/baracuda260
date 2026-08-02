import cartReducer, {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
  selectCartItemCount,
  selectCartTotal,
  selectIsInCart,
  selectCartItemById,
} from '../cartSlice';

const emptyState = { items: [], totalItems: 0, totalPrice: 0 };

const productA = { id: 'p1', name: 'Widget', price: 10 };
const productB = { id: 'p2', name: 'Gadget', price: 25 };

describe('cartSlice reducers', () => {
  describe('addToCart', () => {
    it('adds a new item with quantity 1', () => {
      const state = cartReducer(emptyState, addToCart(productA));
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toMatchObject({ id: 'p1', quantity: 1 });
      expect(state.totalItems).toBe(1);
      expect(state.totalPrice).toBe(10);
    });

    it('increments quantity when item already exists', () => {
      const after1 = cartReducer(emptyState, addToCart(productA));
      const after2 = cartReducer(after1, addToCart(productA));
      expect(after2.items).toHaveLength(1);
      expect(after2.items[0].quantity).toBe(2);
      expect(after2.totalItems).toBe(2);
      expect(after2.totalPrice).toBe(20);
    });

    it('adds multiple distinct items', () => {
      const after1 = cartReducer(emptyState, addToCart(productA));
      const after2 = cartReducer(after1, addToCart(productB));
      expect(after2.items).toHaveLength(2);
      expect(after2.totalItems).toBe(2);
      expect(after2.totalPrice).toBe(35);
    });
  });

  describe('removeFromCart', () => {
    it('removes the item and recalculates totals', () => {
      const withItem = cartReducer(emptyState, addToCart(productA));
      const state = cartReducer(withItem, removeFromCart('p1'));
      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });

  describe('increaseQuantity', () => {
    it('adds 1 to the item quantity and updates totals', () => {
      const withItem = cartReducer(emptyState, addToCart(productA));
      const state = cartReducer(withItem, increaseQuantity('p1'));
      expect(state.items[0].quantity).toBe(2);
      expect(state.totalItems).toBe(2);
      expect(state.totalPrice).toBe(20);
    });
  });

  describe('decreaseQuantity', () => {
    it('subtracts 1 when quantity is above 1', () => {
      const with2 = cartReducer(
        cartReducer(emptyState, addToCart(productA)),
        addToCart(productA),
      );
      const state = cartReducer(with2, decreaseQuantity('p1'));
      expect(state.items[0].quantity).toBe(1);
      expect(state.totalItems).toBe(1);
    });

    it('does not go below 1', () => {
      const withItem = cartReducer(emptyState, addToCart(productA));
      const state = cartReducer(withItem, decreaseQuantity('p1'));
      expect(state.items[0].quantity).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('empties all items and resets totals', () => {
      const populated = cartReducer(
        cartReducer(emptyState, addToCart(productA)),
        addToCart(productB),
      );
      const state = cartReducer(populated, clearCart());
      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });
});

describe('cartSlice selectors', () => {
  const stateWith2 = cartReducer(
    cartReducer(emptyState, addToCart(productA)),
    addToCart(productB),
  );
  const rootState = { cart: stateWith2 };

  it('selectCartItems returns items array', () => {
    expect(selectCartItems(rootState)).toHaveLength(2);
  });

  it('selectTotalItems returns correct count', () => {
    expect(selectTotalItems(rootState)).toBe(2);
  });

  it('selectTotalPrice returns correct price', () => {
    expect(selectTotalPrice(rootState)).toBe(35);
  });

  it('selectCartItemCount (memoized) returns sum of quantities', () => {
    expect(selectCartItemCount(rootState)).toBe(2);
  });

  it('selectCartTotal (memoized) returns sum of prices', () => {
    expect(selectCartTotal(rootState)).toBe(35);
  });

  it('selectIsInCart returns true for an item in cart', () => {
    expect(selectIsInCart('p1')(rootState)).toBe(true);
  });

  it('selectIsInCart returns false for an item not in cart', () => {
    expect(selectIsInCart('p99')(rootState)).toBe(false);
  });

  it('selectCartItemById returns the correct item', () => {
    const item = selectCartItemById('p2')(rootState);
    expect(item).toMatchObject({ id: 'p2', name: 'Gadget' });
  });
});
