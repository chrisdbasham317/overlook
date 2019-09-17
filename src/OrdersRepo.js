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

  calculateUserChargesAllTime(id) {
    let chargeHistory = this.getOrdersByUser(id);
    let totalCost = chargeHistory.reduce((total, currentCharge) => {
      return total += currentCharge.totalCost;
    }, 0);
    return parseFloat(totalCost.toFixed(2));
  }
}




export default OrdersRepo;