import $ from 'jquery';
import './css/base.scss';
import domUpdates from './domUpdates.js';
import bookings from '../data/Bookings.js';
import roomServices from '../data/Room-services.js';
import rooms from '../data/Rooms.js';
import users from '../data/Users.js'

import BookingRepo from './BookingRepo.js';
import UserRepo from './UserRepo.js';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'
console.log('This is the JavaScript entry file - your code begins here.');

let userRepo = new UserRepo(users);
let currentCustomer;

$('.button--login').click(() => {
  event.preventDefault();
  domUpdates.appendText('.h2--welcome', `Welcome ${$('.input--login').val()}`);
  $('.div--modal-login').toggle();
});

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
  domUpdates.toggleTabs($('.li--rooms'));
  domUpdates.toggleContent($('.section--rooms-content'));
});

$('.li--customer').click(() => {
  domUpdates.toggleTabs($('.li--customer'));
  domUpdates.toggleContent($('.section--customer-content'));
});
// End Tab Control

function displayCurrentUser(name) {
  let $customerName = name;
  let currentCustomer = userRepo.findCurrentUser($customerName);
  domUpdates.appendText('.h2--selected-customer', `Customer: ${currentCustomer.name}; ID: ${currentCustomer.id}`);
}

$('.button--search-customer').click(() => {
  event.preventDefault();
  let $customerName = $('.input--search-customer').val();
  displayCurrentUser($customerName);
});


$('.button--create-customer').click(() => {
  event.preventDefault();
  let $customerName = $('.input--create-customer').val();
  userRepo.addNewUser($customerName);
  displayCurrentUser($customerName);
})
