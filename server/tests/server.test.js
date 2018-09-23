const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [
    {
        _id: new ObjectId(),
        text: 'some todo'
    }, {
        _id: new ObjectId(),
        text: 'some other',
        completed: true,
        completedAt: 666
    }
];

// clear the db before each test
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'some test text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find({text: 'some test text'}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should not create a todo with a BS body', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(err => done(err));
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
                done();
            })
            .end((err, res) => {
                if(err) return done(err);

            });
    })
});

describe('GET /todos/:id', () => {
    it('should return todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
                done();
            })
            .end((err, res) => {
                if(err) return done(err);

            });
    })

    it('should return an error 404 if todo not found', (done) => {
        const hexId = new ObjectId().toHexString();

        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return an error 404 if id is not valid', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todos) => {
                    expect(todos).toNotExist();
                    done();
                }).catch(err => done(err));
            });
    });
    
    it('should return an error 404 if todo not found', (done) => {
        const hexId = new ObjectId().toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return an error 404 if id is not valid', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos', () => {
    it('should update a todo', (done) => {
        const hexId = todos[0]._id.toHexString();
        const text = 'updated test';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({ "text": text, "completed": true })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo.completedAt).toBeA('number');
                    expect(todo.text).toBe(text);
                    done();
                }).catch(err => done(err));
            });
    });

    it('should clear completedAt when a todo is not completed', (done) => {
        const hexId = todos[1]._id.toHexString();

        request(app)
            .patch(`/todos/${hexId}`)
            .send({ "completed": false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toNotBe(true);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo.completedAt).toNotExist();
                    done();
                }).catch(err => done(err));
            });
    });
    
    it('should return an error 404 if todo not found', (done) => {
        const hexId = new ObjectId().toHexString();

        request(app)
            .patch(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return an error 404 if id is not valid', (done) => {
        request(app)
            .patch('/todos/123')
            .expect(404)
            .end(done);
    });
});
