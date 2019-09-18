import $ from 'jquery';
import './css/base.scss';
import domUpdates from './domUpdates.js';
import roomServices from '../data/Room-services.js';

import BookingRepo from './BookingRepo.js';
import UserRepo from './UserRepo.js';
import OrdersRepo from './OrdersRepo.js';

let userRepo 
let bookingRepo
let ordersRepo
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
    ordersRepo = new OrdersRepo(data[3].roomServices);
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
    let bookingRevenue = bookingRepo.calculateRevenue(dateToday);
    let servicesToday = ordersRepo.getOrdersByDate(dateToday);
    let servicesRevenue = ordersRepo.calculateCost(servicesToday);
    let totalRevenue = bookingRevenue + servicesRevenue;
    domUpdates.appendText('.p--rooms-available', `${availableRooms} Vacancies Today`);
    domUpdates.appendText('.p--percent-occupied', `${percentOccupied}`);
    domUpdates.appendText('.p--todays-revenue', `$${parseFloat(totalRevenue.toFixed(2))}`);
    domUpdates.appendText('.h3--date', `Today's Date: ${dateToday}`);
  });
}

function validateDate(date) {
  return date.split('').length === 10 ? true : false;
}

// Tab Control
$('.li--main').click(() => {
  updateBookingArrays(dateToday);
  domUpdates.toggleTabs($('.li--main'));
  domUpdates.toggleContent($('.section--main-content'));
});

$('.li--orders').click(() => {
  let $customerText = $('.h2--selected-customer').text()
  domUpdates.clearElement('.table--orders-today');
  domUpdates.clearElement
  domUpdates.clearElement('.table--customer-all-time-orders')
  if ($customerText === 'Customer: Not Selected') {
    displayGeneralOrderInfo();
  } else {
    displayCustomerOrderInfo();
  }
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
  domUpdates.hideElement('.div--customer-room-info');
  domUpdates.showElement('.div--general-room-info');
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
  if (desiredRooms.length !== 0 && validateDate($date)) {
    return updateRoomTable(desiredRooms, '.table--room-results');
  } else {
    domUpdates.appendText('.p--room-error', 'Invalid Date');
  }
});

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
  domUpdates.hideElement('.div--general-room-info');
  domUpdates.showElement('.div--customer-room-info');
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
})
// end room tab

// orders tab
function displayGeneralOrderInfo() {
  let ordersToday = ordersRepo.getOrdersByDate(dateToday);
  domUpdates.hideElement('.div--customer-order-info');
  domUpdates.showElement('.div--general-order-info');
  updateOrdersTable(ordersToday, '.table--orders-today');
}

function displayCustomerOrderInfo() {
  let customerID = currentCustomer.id;
  let orderHistory = ordersRepo.getOrdersByUser(customerID);
  console.log(orderHistory);
  domUpdates.showElement('.div--customer-order-info');
  domUpdates.hideElement('.div--general-order-info');
  if (orderHistory.length !== 0) {
    updateOrdersTable(orderHistory, '.table--customer-all-time-orders');
  } else {
    domUpdates.appendText('.p--order-history-error', 'History Unavailable for This Customer');
  }
}

function updateOrdersTable(orders, table) {
  domUpdates.addText(
    `<th>Customer ID</th>
    <th>Food</th>
    <th>Cost</th>`, table);
  orders.forEach(order => domUpdates.addText(
    `<tr class="tr tr--orders">
    <td>${order.userID}</td>
    <td>${order.food}</td>
    <td>${order.totalCost}</td>
    </tr>`, table));
}

$('.button--order-search').click(() => {
  event.preventDefault();
  let $date = $('.input--order-search').val();
  let orderData = ordersRepo.getOrdersByDate($date);
  domUpdates.clearElement('.table--search-orders')
  if (orderData.length !== 0 && validateDate($date)) {
    updateOrdersTable(orderData, '.table--search-orders');
  } else {
    domUpdates.appendText('.p--order-search-error', 'No Data Available for that Date. Please Check Date Format.');
  }
})