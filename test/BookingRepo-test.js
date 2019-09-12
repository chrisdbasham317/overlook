import chai from 'chai';
const expect = chai.expect;

import rooms from '../data/Rooms.js';
import bookingData from '../data/Bookings';
import BookingRepo from '../src/BookingRepo.js';

describe('bookingRepo', () => {
  let bookingRepo;
  beforeEach(() => {
    bookingRepo = new BookingRepo(rooms.rooms, bookingData.bookings);
    bookingRepo.getReservedRooms('2019/10/29');
    bookingRepo.getAvailableRooms();
  });
  
  it('should return true', () => {
    expect(true).to.equal(true);
  });

  it('should store all the hotel\'s rooms', () => {
    expect(bookingRepo.rooms.length).to.equal(50);
  });

  it('should store all the hotel\'s current bookings', () => {
    expect(bookingRepo.currentBookings.length).to.equal(26);
  });

  it('should store what rooms are reserved on a given date', () => {
    expect(bookingRepo.reservedRooms).to.deep.equal([{
      userID: 7,
      date: "2019/10/29",
      roomNumber: 34
    }, {
      userID: 2,
      date: "2019/10/29",
      roomNumber: 2
    }]);
  });

  it('should return what rooms are available on a given date', () => {
    expect(bookingRepo.availableRooms.length).to.equal(48);
  });

  it('should calculate what percentage of rooms are occupied on a given date', () => {
    expect(bookingRepo.calculatePercentBooked()).to.equal('4%');
  })
});
