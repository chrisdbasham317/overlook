import $ from 'jquery';
import './css/base.scss';
import domUpdates from './domUpdates.js';
import bookings from '../data/Bookings.js';
import roomServices from '../data/Room-services.js';
import rooms from '../data/Rooms.js';
import users from '../data/Users.js'

import BookingRepo from './BookingRepo.js';
import UserRepo from './UserRepo.js';

import './images/turing-logo.png'


let userRepo = new UserRepo(users);
let bookingRepo = new BookingRepo(rooms.rooms, bookings.bookings);
let currentCustomer = {};
const dateToday = `${new Date().getFullYear()}/0${new Date().getMonth() + 1}/${new Date().getDate()}`;

// login modal logic
$('.button--login').click(() => {
  event.preventDefault();
  domUpdates.appendText('.h2--welcome', `Welcome ${$('.input--login').val()}`);
  $('.div--modal-login').toggle();
});
// end modal logic

$(document).ready(() => {
  bookingRepo.getReservedRooms(dateToday);
  bookingRepo.getAvailableRooms();
  let availableRooms = bookingRepo.availableRooms.length;
  let percentOccupied = bookingRepo.calculatePercentBooked();
  
  domUpdates.appendText('.p--rooms-available', `${availableRooms} Vacancies Today`);
  domUpdates.appendText('.p--percent-occupied', `${percentOccupied}`);
  domUpdates.appendText('.h3--date', `Today's Date: ${dateToday}`);
})

// Tab Control
$('.li--main').click(() => {
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
  let $customerNameField = $('.input--search-customer');
  displayCurrentUser($customerNameField.val());
  domUpdates.clearField($customerNameField);
});


$('.button--create-customer').click(() => {
  event.preventDefault();
  let $customerNameField = $('.input--create-customer');
  userRepo.addNewUser($customerNameField.val());
  displayCurrentUser($customerNameField.val());
  domUpdates.clearField($customerNameField);
})

$('.button--close-modal').click(() => {
  event.preventDefault();
  domUpdates.toggleModal();
})

function toggleError(element, error) {
  domUpdates.appendText(element, error);
  domUpdates.toggleModal();
}

function displayCurrentUser(name) {
  let $customerName = name;
  let currentCustomer = userRepo.findCurrentUser($customerName);
  if (currentCustomer === undefined) {
    toggleError('.p--error-text', 'That customer does not exist. Please search again, or create a new customer.');
  } else {
    domUpdates.appendText('.h2--selected-customer', `Customer: ${currentCustomer.name}; ID: ${currentCustomer.id}`);
  }  
}
// end customer tab

// room tab
function displayGeneralRoomInfo() {
  let popularDate = bookingRepo.findPopularDate();
  let availableDate = bookingRepo.findMostOpenings();
  domUpdates.appendText('.p--popular-date', `${popularDate}`);
  domUpdates.appendText('.p--most-available-date', `${availableDate}`);
}

$('.button--room-search').click(() => {
  event.preventDefault();
  let $date = $('.input--room-search').val();
  bookingRepo.getReservedRooms($date);
  bookingRepo.getAvailableRooms();
  domUpdates.clearElement('.table--room-results');
  domUpdates.clearElement('.p--room-error');
  let desiredRooms = bookingRepo.availableRooms;
  if (desiredRooms !== [] && validateDate($date)) {
    return updateRoomSearchTable(desiredRooms);
  } else {
    domUpdates.appendText('.p--room-error', 'Invalid Date');
  }
});

function validateDate(date) {
  return date.split('').length === 10 ? true : false;
}

function updateRoomSearchTable(rooms) {
  domUpdates.addText(
    `<th>Room Number</th>
    <th>Bed Size</th>
    <th>Number of Beds</th>
    <th>Cost Per Night</th>`, '.table--room-results');
  rooms.forEach(room => domUpdates.addText(
    `<tr class="tr tr--room-results">
  <td>${room.number}</td>
  <td>${room.bedSize}</td>
  <td>${room.numBeds}</td>
  <td>${room.costPerNight}</td>
  </tr>`, '.table--room-results'));
}

function displayCustomerRoomInfo() {
  
}
// end room tab