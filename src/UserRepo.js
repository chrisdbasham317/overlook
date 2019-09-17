class UserRepo {
  constructor(data) {
    this.users = data;
    this.currentUser = {};
  }

  findCurrentUser(name) {
    let foundUser = this.users.filter(user => user.name === name);
    return this.currentUser = foundUser[0];
  }

  addNewUser(newName) {
    let newId = this.users.sort((userA, userB) => userB.id - userA.id)[0].id + 1;
    let newUser = { id: newId, name: newName };
    this.users.push(newUser);
    this.findCurrentUser(newUser.name);
  }
}

export default UserRepo;