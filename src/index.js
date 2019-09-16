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

function displayCurrentUser(name) {
  let $customerName = name;
  let currentCustomer = userRepo.findCurrentUser($customerName);
  if (currentCustomer === undefined) {
    toggleError('.p--error-text', 'That customer does not exist. Please search again, or create a new customer.');
  } else {
    domUpdates.appendText('.h2--selected-customer', `Customer: ${currentCustomer.name}; ID: ${currentCustomer.id}`);
  }  
}

function toggleError(element, error) {
  domUpdates.appendText(element, error);
  domUpdates.toggleModal();
}
