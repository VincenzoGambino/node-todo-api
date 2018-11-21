const {mongoose} =  require('./../server/db/mongoose');

const {ObjectID} = require('mongodb');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

 var id_todo = '5bf5491ce2da1d047394a1df';
 var id_user = '5bf43584c7e28406d3f73a92';
//
// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }
//
// Todo.find({
//   _id: id_todo
// }).then((todos) => {
//   console.log('Todos', todos);
// }).catch((e) => {
//   console.log(e);
// });

// Todo.findOne({
//   _id: id_todo
// }).then((todo) => {
//   console.log('Todo', todo);
// }).catch((e) => {
//   console.log(e);
// });
//
// Todo.findById(id_todo).then((todo) => {
//   console.log('Todo by id', todo);
// }).catch((e) => {
//   console.log(e);
// });

User.findById(id_user).then((user) => {
  if (!user) {
    return console.log('User not found');
  }
  console.log('User', user);
}).catch((e) => {
  console.log(e);
});