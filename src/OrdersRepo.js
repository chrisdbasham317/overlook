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
}




export default OrdersRepo;