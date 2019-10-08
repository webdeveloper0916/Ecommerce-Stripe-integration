/* global jest, describe, it, expect, beforeEach */
jest.mock('axios');
jest.mock('../../commerce');

import Cart from '../cart';
import Commerce from '../../commerce';
import axios from 'axios';

const realCommerce = jest.requireActual('../../commerce').default;

let eventMock;
let storageGetMock;
let storageSetMock;
let mockCommerce;
let mockCallback;
let mockErrorCallback;

beforeEach(() => {
  Commerce.mockClear();

  eventMock = jest.fn();
  storageGetMock = jest.fn();
  storageSetMock = jest.fn();

  const commerceImpl = {
    options: {
      url: 'http://localhost/',
      publicKey: 'test',
      version: 'v1',
    },
    cart: {
      cart_id: null
    },
    event: eventMock,
    storage: {
      get: storageGetMock,
      set: storageSetMock
    }
  };

  commerceImpl.request = realCommerce.prototype.request.bind(commerceImpl);

  Commerce.mockImplementation(() => commerceImpl);

  mockCommerce = new Commerce('foo', true);

  // Used for API proxy methods
  mockCallback = jest.fn();
  mockErrorCallback = jest.fn();

  axios.mockImplementation(() => Promise.resolve({ status: 200, data: { id: '12345' } }));
});

describe('Cart', () => {
  describe('id', () => {
    it('initializes a new ID when none is stored', async () => {
      storageGetMock.mockReturnValue(null);

      const cart = new Cart(mockCommerce);

      await cart.id();

      expect(mockCommerce.storage.get).toHaveBeenCalled();
      // Ensure that `Cart.refresh()` was called
      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        url: 'carts',
      }));
    });

    it('initializes from the stored ID', async () => {
      storageGetMock.mockReturnValue('123');

      const cart = new Cart(mockCommerce);

      await cart.id();

      expect(mockCommerce.storage.get).toHaveBeenCalled();
      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        url: 'carts/123',
        method: 'get',
      }));
    });
  });

  describe('refresh', () => {
    it('sets the card ID and fires a ready event', async () => {
      const cart = new Cart(mockCommerce);
      await cart.refresh();

      expect(storageSetMock).toHaveBeenCalledWith(
        'commercejs_cart_id',
        '12345',
        30
      );
    });
  });

  describe('id', () => {
    it('returns the cart ID', async () => {
      const cart = new Cart(mockCommerce);

      expect(await cart.id()).toBe('12345');
    });
  });

  describe('add', () => {
    it('proxies the request method', async () => {
      storageGetMock.mockReturnValue('12345');

      const cart = new Cart(mockCommerce, '12345');
      const data = { foo: 'bar' };

      await cart.add(data);

      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        url: 'carts/12345',
        method: 'post',
        data,
      }));
    });
  });

  describe('retrieve', () => {
    it('proxies the request method', async () => {
      const cart = new Cart(mockCommerce);
      storageGetMock.mockReturnValue('12345');
      await cart.retrieve();

      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        url: 'carts/12345',
      }));
    });
  });

  describe('remove', () => {
    it('proxies the request method', async () => {
      const cart = new Cart(mockCommerce);
      const lineId = '98765';
      await cart.remove(lineId);

      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        url: 'carts/12345/items/98765',
        method: 'delete',
      }));
    });
  });

  describe('delete', () => {
    it('proxies the request method', async () => {
      const cart = new Cart(mockCommerce);
      await cart.delete();

      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        url: 'carts/12345',
        method: 'delete',
      }));
    });
  });

  describe('update', () => {
    it('proxies the request method', async () => {
      const cart = new Cart(mockCommerce);
      const lineId = '98765';
      const data = { foo: 'bar' };
      await cart.update(lineId, data);

      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        url: 'carts/12345/items/98765',
        method: 'put',
        data,
      }));
    });
  });

  describe('contents', () => {
    it('proxies the request method', async () => {
      const cart = new Cart(mockCommerce);
      await cart.contents();

      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        url: 'carts/12345/items',
        method: 'get',
      }));
    });
  });

  describe('empty', () => {
    it('proxies the request method', async () => {
      const cart = new Cart(mockCommerce);
      await cart.empty();

      expect(axios).toHaveBeenCalledWith(expect.objectContaining({
        url: 'carts/12345/items',
        method: 'delete',
      }));
    });
  });
});
