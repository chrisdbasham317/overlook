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
});
