const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: '1',
        name: 'Ziggy',
        room: 'Stardust room'
      },
      {
        id: '2',
        name: 'Page',
        room: 'Led Zeppelin room'
      },
      {
        id: '3',
        name: 'Curtis',
        room: 'Stardust room'
      }
    ];
  });

  it('should add new user', () => {
    let users = new Users();
    let user = {
      id: '234',
      name: 'Gilmour',
      room: 'Dark Side of the Room'
    };
    let resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    let userId = '1';
    let user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2)
  });

  it('should not remove a user', () => {
    let userId = '5';
    let user = users.removeUser(userId);

    expect(user).toBeFalsy();
    expect(users.users.length).toBe(3)
  });

  it('should find user', () => {
    let userId = '3';
    let user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });
  
  it('should not find user', () => {
    let userId = '4';
    let user = users.getUser(userId);

    expect(user).toBeFalsy();
  });

  it('should return names for Stardust room', () => {
    let userList = users.getUserList('Stardust room');

    expect(userList).toEqual(['Ziggy', 'Curtis']);
  });

  it('should return names for Led Zeppelin room', () => {
    let userList = users.getUserList('Led Zeppelin room');

    expect(userList).toEqual(['Page']);
  });
});
