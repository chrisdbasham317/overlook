import $ from 'jquery';
import './css/base.scss';
import domUpdates from './domUpdates.js';
import roomServices from '../data/Room-services.js';

import BookingRepo from './BookingRepo.js';
import UserRepo from './UserRepo.js';

let userRepo 
let bookingRepo
let currentCustomer = {};
const dateToday = `${new Date().getFullYear()}/0${new Date().getMonth() + 1}/${new Date().getDate()}`;

Promise.all([
  fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users')
    .then(response => response.json()),
  fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms')
    .then(response => response.json()),
  fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings')
    .then(response => response.json()),
  fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/room-services/roomServices')
    .then(response => response.json()),
])
  .then(data => {
    userRepo = new UserRepo(data[0].users);
    bookingRepo = new BookingRepo(data[1].rooms, data[2].bookings);
    runStartLogic();
  });

// const dateToday = '2019/09/01';

// login modal logic
$('.button--login').click(() => {
  event.preventDefault();
  domUpdates.appendText('.h2--welcome', `Welcome ${$('.input--login').val()}`);
  $('.div--modal-login').toggle();
});
// end modal logic
function runStartLogic() {
  $(document).ready(() => {
    updateBookingArrays(dateToday);
    let availableRooms = bookingRepo.availableRooms.length;
    let percentOccupied = bookingRepo.calculatePercentBooked();
  
    domUpdates.appendText('.p--rooms-available', `${availableRooms} Vacancies Today`);
    domUpdates.appendText('.p--percent-occupied', `${percentOccupied}`);
    domUpdates.appendText('.h3--date', `Today's Date: ${dateToday}`);
  })
}

// Tab Control
$('.li--main').click(() => {
  updateBookingArrays(dateToday);
  domUpdates.toggleTabs($('.li--main'));
  domUpdates.toggleContent($('.section--main-content'));
});

$('.li--orders').click(() => {
  domUpdates.toggleTabs($('.li--orders'));
  domUpdates.toggleContent($('.section--orders-content'));
});

$('.li--rooms').click(() => {
  let $customerText = $('.h2--selected-customer').text()
  if ($customerText === 'Customer: Not Selected') {
    displayGeneralRoomInfo();
  } else {
    displayCustomerRoomInfo();
  }
  domUpdates.toggleTabs($('.li--rooms'));
  domUpdates.toggleContent($('.section--rooms-content'));
});

$('.li--customer').click(() => {
  domUpdates.toggleTabs($('.li--customer'));
  domUpdates.toggleContent($('.section--customer-content'));
});
// End Tab Control

// customer tab
$('.button--search-customer').click(() => {
  event.preventDefault();
  domUpdates.removeElement('.tr--customer-room-results');
  let $customerNameField = $('.input--search-customer');
  displayCurrentUser($customerNameField.val());
  domUpdates.clearField($customerNameField);
});


$('.button--create-customer').click(() => {
  event.preventDefault();
  domUpdates.removeElement('.tr--customer-room-results');
  let $customerNameField = $('.input--create-customer');
  userRepo.addNewUser($customerNameField.val());
  displayCurrentUser($customerNameField.val());
  domUpdates.clearField($customerNameField);
})

$('.button--close-modal').click(() => {
  event.preventDefault();
  domUpdates.toggleModal('.section--error');
})

function toggleError(element, error) {
  domUpdates.appendText(element, error);
  domUpdates.toggleModal('.section--error');
}

function displayCurrentUser(name) {
  let $customerName = name;
  currentCustomer = userRepo.findCurrentUser($customerName);
  if (currentCustomer === undefined) {
    toggleError('.p--error-text', 'That customer does not exist. Please search again, or create a new customer.');
    domUpdates.appendText('.h2--selected-customer', `Customer: Not Selected`);   
  } else {
    domUpdates.appendText('.h2--selected-customer', `Customer: ${currentCustomer.name}; ID: ${currentCustomer.id}`);
  }  
}
// end customer tab

// room tab
function displayGeneralRoomInfo() {
  $('.div--general-room-info').show();
  $('.div--customer-room-info').hide();
  let popularDate = bookingRepo.findPopularDate();
  let availableDate = bookingRepo.findMostOpenings();
  domUpdates.appendText('.p--popular-date', `${popularDate}`);
  domUpdates.appendText('.p--most-available-date', `${availableDate}`);
  domUpdates.appendText('.p--percent-occupied', `${bookingRepo.calculatePercentBooked()}`);
}

function updateBookingArrays(date) {
  bookingRepo.getReservedRooms(date);
  bookingRepo.getAvailableRooms();
}

$('.button--room-search').click(() => {
  event.preventDefault();
  let $date = $('.input--room-search').val();
  updateBookingArrays($date);
  domUpdates.clearElement('.table--room-results');
  domUpdates.clearElement('.p--room-error');
  let desiredRooms = bookingRepo.availableRooms;
  if (desiredRooms !== [] && validateDate($date)) {
    return updateRoomTable(desiredRooms, '.table--room-results');
  } else {
    domUpdates.appendText('.p--room-error', 'Invalid Date');
  }
});

function validateDate(date) {
  return date.split('').length === 10 ? true : false;
}

function updateRoomTable(rooms, table) {
  domUpdates.addText(
    `<th>Room Number</th>
    <th>Room Type</th>
    <th>Number of Beds</th>
    <th>Bed Size</th>
    <th>Bidet</th>
    <th>Cost Per Night</th>`, table);
  rooms.forEach(room => domUpdates.addText(
    `<tr class="tr tr--room-results">
      <td>${room.number}</td>
      <td>${room.roomType}</td>
      <td>${room.numBeds}</td>
      <td>${room.bedSize}</td>
      <td>${room.bidet}</td>
      <td>${room.costPerNight}</td>
    </tr>`, table));
}

function updateBookingTable(bookings) {
  domUpdates.addText(
    `<th>Date</th>
    <th>Room Number</th>`, '.table--customer-room-records');
  bookings.forEach(booking => domUpdates.addText(
    `<tr class="tr tr--customer-room-results">
      <td>${booking.date}</td>
      <td>${booking.roomNumber}</td>
    < /tr>`, '.table--customer-room-records'))
}


function displayCustomerRoomInfo() {
  domUpdates.clearElement('.table--customer-room-records');
  $('.div--general-room-info').hide();
  $('.div--customer-room-info').show();
  showBookingSummary();
}

function showBookingSummary() {
  domUpdates.clearElement('.table--customer-room-records');
  let userHistory = bookingRepo.getUserHistory(currentCustomer.id);
  checkForBookingToday(userHistory);
  if (userHistory.length !== 0) {
    domUpdates.hideElement('.p--customer-room-error');
    updateBookingTable(userHistory);
  } else {
    domUpdates.hideElement()
    domUpdates.toggleShow('.p--customer-room-error');
  }
}

function checkForBookingToday(bookings) {
  let bookingToday = bookings.filter(booking => booking.date === dateToday);
  if (bookingToday.length === 0) {
    domUpdates.showElement('.button--book-room');
  } else {
    domUpdates.hideElement('.button--book-room');
  }
}

$('.button--book-room').click(() => {
  event.preventDefault();
  domUpdates.toggleModal('.div--booking-modal');
});

function closeBookingModal() {
  domUpdates.toggleModal('.div--booking-modal');

}

$('.button--close-bookings').click(() => {
  event.preventDefault();
  closeBookingModal();
})

$('.button--filter-rooms').click(() => {
  event.preventDefault();
  domUpdates.clearElement('.table--filtered-rooms');
  updateBookingArrays(dateToday);
  let $type = $('.select--room-type').val();
  let rooms = bookingRepo.filterRoomsByType($type);
  if (rooms.length === 0) {
    updateRoomTable(bookingRepo.availableRooms, '.table--filtered-rooms');
  } else {
    updateRoomTable(rooms, '.table--filtered-rooms');
  }
});

$('.button--submit-booking').click(() => {
  event.preventDefault();
  let $roomNum = $('.input--submit-booking').val();
  let customer = currentCustomer.id;
  let date = dateToday;
  let booking = { 'userID': customer, 'date': date, 'roomNumber': $roomNum };
  bookingRepo.bookRoom(booking);
  updateBookingArrays(dateToday);
  showBookingSummary();
  closeBookingModal();
  console.log(bookingRepo.reservedRooms);
})
// end room tab