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
}

export default BookingRepo;