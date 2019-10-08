/* global jest, describe, it, expect, beforeEach */

import Products from '../products';
import Commerce from '../../commerce';

jest.mock('../../commerce');

let requestMock;
let mockCommerce;

beforeEach(() => {
  Commerce.mockClear();

  // Commerce mock internals
  requestMock = jest.fn();
  requestMock.mockReturnValue('return');

  Commerce.mockImplementation(() => {
    return {
      request: requestMock,
    };
  });

  mockCommerce = new Commerce('foo', true);
});

describe('Products', () => {
  describe('list', () => {
    it('proxies the request method', () => {
      const products = new Products(mockCommerce);
      const returnValue = products.list({ foo: 'bar' });

      expect(requestMock).toHaveBeenLastCalledWith('products', 'get', {
        foo: 'bar',
      });
      expect(returnValue).toBe('return');
    });
  });

  describe('retrieve', () => {
    it('proxies the request method', () => {
      const products = new Products(mockCommerce);
      const returnValue = products.retrieve('SKU-123', { foo: 'bar' });

      expect(requestMock).toHaveBeenLastCalledWith('products/SKU-123', 'get', {
        foo: 'bar',
      });
      expect(returnValue).toBe('return');
    });
  });
});
