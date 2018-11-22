const {mongoose} =  require('./../server/db/mongoose');

const {ObjectID} = require('mongodb');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

Todo.findByIdAndRemove('5bf6bf0b6832fbdd0b662b98').then((doc) => {
  console.log(doc);
}).catch((e) => {
  console.log(e);
});