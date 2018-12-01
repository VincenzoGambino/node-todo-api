require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());


/**
 * POST method for To do.
 * Creates to do items.
 */
app.post('/todos', authenticate, (req, res) => {
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	}
	);
});


/**
 * GET methos for to do.
 * Returns a list of to do.
 */
app.get('/todos', authenticate, (req, res) => {
	Todo.find({
		_creator: req.user._id
	}).then((todos) => {
		if ({todos}) {
      res.send({todos});
		}
		else {
      res.send('No resources found');
		}
	},
		(e) => {
		res.status(400).send(e);
	});
});


/**
 * GET method for a single to do item.
 */
app.get('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.sendStatus(404);
	}
	Todo.findOne({
		_id: id,
		_creator: req.user._id
  }).then((todo) => {
		if (todo) {
			res.send({todo});
		} else {
			res.sendStatus(404);
		}
	}).catch((e) => {
    res.sendStatus(400);
	});
});


/**
 * DELETE method for a single to do item.
 */
app.delete('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.sendStatus(404);
  }
  Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    }

	).then((todo) => {
  	if (!todo) {
      return res.sendStatus(404);
		}
    res.send({todo});
	}).catch((e) => {
		res.sendStatus(400);
	});
});

/**
 * PATCH method for a single to do item.
 */
app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.sendStatus(404);
  }
  var body = _.pick(req.body, ['text', 'completed']);

  if (_.isBoolean(body.completed) && body.completed) {
  	body.completedAt = new Date().getTime();
	}
	else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
		if (!todo) {
			return res.sendStatus(404);
		}
		res.send({todo});
	}).catch((e) => {
		res.sendStatus(400);
	});
});

/**
 * POST method for User creation.
 */
app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);
	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
    res.sendStatus(400);
	});
});

/**
 * GET method for user.
 */
app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
		});
	}).catch((e) => {
		res.sendStatus(400);
	});

});

app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.sendStatus(200);
	}).catch((e) => {
		res.sendStatus(400);
	});
});

app.listen(port, () => {
	console.log('Started on port ' + port);
});



module.exports = {app};