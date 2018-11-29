const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abac!';

var hashed = bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    //console.log(hash);
    return hash;
  })
});
 console.log('hash: ', hashed);
 var hashedPassword = '$2a$10$QLpiFmOxcUjpNDvIS3K5k.B7BuFrbIm7lT2eUUG7kMttaljfxm5ae';
//
bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});
// var data  = {
//   id: 4
// };
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
// console.log('decoded', jwt.verify(token, '123abc'));

// var message = "I am user number 3";
//
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`hash: ${hash}`);
//
// var data  = {
//   id: 4
// }
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHast = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHast === token.hash) {
//   console.log('Data was not changed');
// } else {
//
//   console.log('Data was changed');
// }
