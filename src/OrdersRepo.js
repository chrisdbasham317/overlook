class OrdersRepo {
  constructor(services) {
    this.roomServices = services;
  }

  getOrdersByDate(date) {
    return this.roomServices.filter(order => order.date === date);
  }

  getOrdersByUser(id) {
    return this.roomServices.filter(order => order.userID === id);
  }

  calculateCost(orders) {
    return orders.reduce((total, currentCharge) => {
      return total += currentCharge.totalCost;
    }, 0);
  }

  calculateUserChargesAllTime(id) {
    let chargeHistory = this.getOrdersByUser(id);
    let totalCost = this.calculateCost(chargeHistory);
    return parseFloat(totalCost.toFixed(2));
  }

  calculateUserChargesDate(id, date) {
    let ordersToday = this.getOrdersByUser(id).filter(order => order.date === date);
    let costToday = this.calculateCost(ordersToday);
    return parseFloat(costToday.toFixed(2));
  }
}




export default OrdersRepo;