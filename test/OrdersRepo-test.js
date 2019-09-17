import chai from 'chai';
const expect = chai.expect;

import data from '../data/Room-services';
import OrdersRepo from '../src/OrdersRepo';

describe('Orders', () => {
  let ordersRepo;
  beforeEach(() => {
    ordersRepo = new OrdersRepo(data);
  });

  it('should return true', () => {
    expect(true).to.equal(true);
  });
});