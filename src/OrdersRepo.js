class OrdersRepo {
  constructor(services) {
    this.roomServices = services;
  }

  getOrdersByDate(date) {
    return this.roomServices.filter(order => order.date === date);
  }
}




export default OrdersRepo;