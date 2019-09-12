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
    let reservedRooms = this.reservedRooms.map(booking => booking.roomNumber);
    this.availableRooms = this.rooms.filter(room => !reservedRooms.includes(room.number));
  }

  calculatePercentBooked() {
    let booked = this.reservedRooms.length / this.rooms.length;
    let percent = Math.round(booked * 100);
    return `${percent}%`;
  }

  findPopularDate() {
    let filteredDates = [];
    this.currentBookings.forEach(booking => filteredDates.push(this.filterByDate(booking.date)))
    let sortedDates = filteredDates.sort((arr1, arr2) => arr2.length - arr1.length);
    return sortedDates[0][0].date;
  }

  filterByDate(date) {
    let filteredDates = this.currentBookings.filter(booking => {
      return booking.date === date;
    });
    return filteredDates;
  }
}

export default BookingRepo;