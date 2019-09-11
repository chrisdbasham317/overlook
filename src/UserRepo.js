class UserRepo {
  constructor(data) {
    this.users = data.users;
    this.currentUser = {};
  }

  findCurrentUser(name) {
    let foundUser = this.users.filter(user => user.name === name);
    return this.currentUser = foundUser[0];
  }

  addNewUser(id, name) {
    
  }
}

export default UserRepo;