class BookingRepo {
  constructor(rooms, bookings) {
    this.rooms = rooms;
    this.currentBookings = bookings;
    this.availableRooms = [];
    this.reservedRooms = [];
  }
  getReservedRooms(date) {
    return this.reservedRooms = this.currentBookings.filter(booking => booking.date === date);
  }

  getAvailableRooms() {
    if (this.reservedRooms === []) {
      this.availableRooms = this.rooms;
    } else {
      let reservedRooms = this.reservedRooms.map(booking => booking.roomNumber);
      this.availableRooms = this.rooms.filter(room => !reservedRooms.includes(room.number));
    }
  }

  calculatePercentBooked() {
    let booked = this.reservedRooms.length / this.rooms.length;
    let percent = Math.round(booked * 100);
    return `${percent}%`;
  }

  findPopularDate() {
    let filteredDates = this.getBookingDates();
    let sortedDates = this.sortDescending(filteredDates);
    return sortedDates[0][0].date;
  }

  findMostOpenings() {
    let filteredDates = this.getBookingDates();
    let sortedDates = this.sortAscending(filteredDates);
    return sortedDates[0][0].date;
  }

  getBookingDates() {
    let filteredDates = [];
    this.currentBookings.forEach(booking => filteredDates.push(this.filterByDate(booking.date)))
    return filteredDates;
  }

  sortAscending(arr) {
    return arr.sort((arr1, arr2) => arr1.length - arr2.length);
  };

  sortDescending(arr) {
    return arr.sort((arr1, arr2) => arr2.length - arr1.length);
  }

  filterByDate(date) {
    let filteredDates = this.currentBookings.filter(booking => {
      return booking.date === date;
    });
    return filteredDates;
  }

  bookRoom(booking) {
    this.currentBookings.push(booking);
  }

  cancelBooking(id, date) {
    let bookingIndex = this.currentBookings.findIndex(booking => booking.userID === id ? booking.date === date ? booking : undefined : undefined);
    return bookingIndex ? this.currentBookings.splice(bookingIndex, 1) : undefined;
  }

  getUserHistory(id) {
    let userHistory = this.currentBookings.filter(booking => booking.userID === id);
    return userHistory !== [] ? userHistory : undefined;
  }

  filterRoomsByType(type) {
    return this.availableRooms.filter(room => room.roomType.toUpperCase() === type.toUpperCase());
  }

  calculateRevenue(date) {
    this.getReservedRooms(date);
    let roomNumbersReserved = this.reservedRooms.map(reservation => reservation.roomNumber);
    let roomsBooked = this.rooms.filter(room => roomNumbersReserved.includes(room.number));
    let totalRevenue = roomsBooked.reduce((total, room) => {
      return total += room.costPerNight;
    }, 0)
    return parseFloat(totalRevenue.toFixed(2));
  }
}

export default BookingRepo;