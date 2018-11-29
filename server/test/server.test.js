const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {server} = require('./../server');

const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, seedTodos, users, seedUsers} = require('./seed/seed');

beforeEach(seedUsers);
beforeEach(seedTodos);


describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });


  it('should not create to do with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => {
          done(e);
        });

      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      }).end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return a todo doc', (done) => {
    var real_id  = todos[0]._id.toHexString();
    request(app)
      .get('/todos/' + real_id)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      }).end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var fake_id = new ObjectID().toHexString();
    request(app)
      .get('/todos/' + fake_id)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete a todo doc', (done) => {
    var real_id = todos[0]._id.toHexString();
    request(app)
      .delete('/todos/' + real_id)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(real_id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(real_id).then((todo) => {
          expect(todo).toBe(null);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });

  it('should return 404 if todo not found', (done) => {
    var fake_id = new ObjectID().toHexString();
    request(app)
      .delete('/todos/' + fake_id)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it ('should update the todo', (done) => {
    var real_id = todos[0]._id.toHexString();
    var new_text = 'Updated from test';
    request(app)
      .patch('/todos/' + real_id)
      .send({
        completed: true,
        text: new_text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(new_text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number')
      })
      .end(done);

  });

  it ('should update the todo', (done) => {
    var real_id = todos[1]._id.toHexString();
    var new_text = 'Updated from test';
    request(app)
      .patch('/todos/' + real_id)
      .send({
        completed: false,
        text: new_text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(new_text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });
});


describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      }).end(done);
    });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      }).end(done);
  });
});


describe('POST /users', () => {
  it('should create user', (done) => {
    var email = 'example@example.com';
    var password = '123abc!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      }).end((err) => {
        if (err) {
          return done(err);
        }
        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => {
          done(e);
        });
    });
  });

  it('should return error validation errors if request invalid', (done) => {
    var email = 'exampleexample.com';
    var password = '12!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email is use', (done) => {
    var email = users[0].email;
    var password = '123abc!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login end retrieve the token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.lenght).toBeFalsy();
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });
});
