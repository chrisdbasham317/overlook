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

  it('should return all service charges for a given date', () => {
    expect(ordersRepo.getOrdersByDate('2019/08/11').length).to.equal(2);
  });

  it('should return all service charges for a user', () => {
    expect(ordersRepo.getOrdersByUser(2).length).to.equal(4);
  });

  it('should calculate cost of all services for a user', () => {
    expect(ordersRepo.calculateUserChargesAllTime(2)).to.equal(47.57);
  });

  it('should calculate cost of user services for a given date', () => {
    expect(ordersRepo.calculateUserChargesDate(2, '2019/08/08')).to.equal(7.47);
  });

  it('should be able to create an item list for ordering', () => {
    ordersRepo.getServiceOptions();
    expect(ordersRepo.availableItems.length).to.equal(32);
  })

  it('should be able to place a new order', () => {
    ordersRepo.placeOrder({ userID: 10, date: "2019/09/01", food: "Rustic Cotton Sandwhich", totalCost: 17.33 });
    expect(ordersRepo.roomServices.length).to.equal(33);
  })
});