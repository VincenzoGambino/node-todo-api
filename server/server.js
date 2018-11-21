const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	}
	);
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
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

app.get('/todos/:id', (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.sendStatus(404);
	}
	Todo.findById(id).then((todo) => {
		if (todo) {
			res.send({todo});
		} else {
			res.sendStatus(404);
		}
	}).catch((e) => {
    res.sendStatus(400);
	});
});

app.listen(port, () => {
	console.log('Started on port ' . port);
});

module.exports = {app};