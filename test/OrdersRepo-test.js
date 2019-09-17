import chai from 'chai';
const expect = chai.expect;

import data from '../data/Room-services';
import OrdersRepo from '../src/OrdersRepo';

describe('Orders', () => {
  let ordersRepo;
  beforeEach(() => {
    ordersRepo = new OrdersRepo(data.roomServices);
  });

  it('should return true', () => {
    expect(true).to.equal(true);
  });

  it('should return all room charges for a given date', () => {
    expect(ordersRepo.getOrdersByDate('2019/08/11').length).to.equal(2);
  });


});