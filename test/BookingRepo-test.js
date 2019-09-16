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
  });

  it('should find the most popular booking date', () => {
    expect(bookingRepo.findPopularDate()).to.equal('2019/09/01');
  });

  it('should find the date with the most openings', () => {
    expect(bookingRepo.findMostOpenings()).to.equal('2019/10/19');
  });

  it('should store new bookings', () => {
    bookingRepo.bookRoom({ userID: 7, date: "2019/10/29", roomNumber: 35 });
    bookingRepo.getReservedRooms('2019/10/29');
    bookingRepo.getAvailableRooms();
    expect(bookingRepo.currentBookings.length).to.equal(27);
    expect(bookingRepo.reservedRooms.length).to.equal(3);
    expect(bookingRepo.availableRooms.length).to.equal(47);
  });

  it('should be able to cancel a booking', () => {
    bookingRepo.cancelBooking(7, '2019/08/02');
    expect(bookingRepo.currentBookings.length).to.equal(26)
  })

  it('should find a user\'s booking history by id', () => {
    expect(bookingRepo.getUserHistory(4)).to.deep.equal([{
      userID: 4,
      date: "2019/08/28",
      roomNumber: 13
    },
    {
      userID: 4,
      date: "2019/08/29",
      roomNumber: 45
    },
    {
      userID: 4,
      date: "2019/10/07",
      roomNumber: 14
    }]);
  });

  it('should be able to filter rooms by type', () => {
    expect(bookingRepo.filterRoomsByType('residential suite').length).to.equal(8);
  })
});
