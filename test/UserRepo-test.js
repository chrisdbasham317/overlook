import chai from 'chai';
const expect = chai.expect;

import data from '../data/Users.js';
import UserRepo from '../src/UserRepo.js';

describe('UserRepo', () => {
  let users;
  beforeEach(() => {
    users = new UserRepo(data);
  });  
  
  it('should return true', () => {
    expect(true).to.equal(true);
  });

  it('should store all user data', () => {
    expect(users.users.length).to.equal(9);
  });

  it('should be able to search for and return current user', () => {
    users.findCurrentUser('Chadrick Lowe');
    expect(users.currentUser).to.deep.equal({ id: 2, name: "Chadrick Lowe" });
  });

  it('should be able to add a new user, and select them as current user', () => {
    users.addNewUser('Chris Basham');
    expect(users.users).to.deep.include({ id: 10, name: 'Chris Basham' });
    expect(users.currentUser).to.deep.equal({ id: 10, name: 'Chris Basham' });
  });

  it('should have a way to show a customer does not exist in the database', () => {
    users.findCurrentUser('John Smith');
    expect(users.currentUser).to.equal(undefined);
  });
});
