const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');


const  userOneID = new ObjectID();
const  userTwoID = new ObjectID();
const users = [{
  _id: userOneID,
  email: 'me@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneID, access: 'auth'}, 'abc123').toString()
  }]
}, {
    _id: userTwoID,
    email: 'mea@example.com',
    password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoID, access: 'auth'}, 'abc123').toString()
  }]
}];


const todos = [{
    _id: new ObjectID(),
    text: 'first test todo',
  _creator: userOneID
  },
  {
    _id: new ObjectID(),
    text: 'second text todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoID
  }];

const  seedTodos = ((done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});




const seedUsers =  ((done) => {
  User.deleteMany({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
});
module.exports = {todos, seedTodos, users, seedUsers};