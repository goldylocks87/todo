require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const { mongoose } = require('./db/mongoose');

const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT; 

app.use( bodyParser.json() );

app.post('/todos', (req, res) => {

    console.log(req.body);

    var newTodo = new Todo({
        text: req.body.text,
    });

    newTodo.save()
    .then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send({error: 'Bad shit happened...'})
    }).catch(err => console.error(err));
});

app.get('/todos', (req, res) => {

    Todo.find({})
    .then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send({error: 'Bad shit happened...'})
    }).catch(err => console.error(err));
});

app.get('/todos/:id', (req, res) => {

    let id = req.params.id;

    if( !ObjectId.isValid(id) ){
        return res.status(404).send({error: 'Could not find that ish...'}); 
    }

    Todo.findById(id)
    .then((todo) => {
        if(!todo) res.status(404).send({error: 'Could not find that ish...'}); 
        else res.send({todo});

    }, (err) => {
        res.status(400).send({error: 'Bad shit happened...'})
    }).catch(err => console.error(err)); 
});

app.delete('/todos/:id', (req, res) => {

    let id = req.params.id;

    if( !ObjectId.isValid(id) ){
        return res.status(404).send({error: 'Could not find that ish...'}); 
    }

    Todo.findByIdAndRemove(id)
    .then((todo) => {
        if(!todo) res.status(404).send({error: 'Could not find that ish...'}); 
        else res.send({todo});

    }, (err) => {
        res.status(400).send({error: 'Bad shit happened...'})
    }).catch(err => console.error(err)); 
});

app.patch('/todos/:id', (req, res) => {

    let id = req.params.id;

    // pick off props that we want users to be able to change
    let body = _.pick(req.body, ['text','completed']);

    if( !ObjectId.isValid(id) ){
        return res.status(404).send({error: 'Could not find that ish...'}); 
    }

    if( _.isBoolean(body.completed) && body.completed ){
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then((todo) => {
        if(!todo) res.status(404).send({error: 'Could not find that ish...'}); 
        else res.send({todo});

    }, (err) => {
        res.status(400).send({error: 'Bad shit happened...'})
    }).catch(err => console.error(err)); 
});

module.exports = { app };

app.listen(port, () => {
    console.log(`started app on port ${port}...`);
});