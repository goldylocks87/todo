const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

const {mongoose} = require('./db/mongoose');

const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000; 

app.use( bodyParser.json() );

app.post('/todos', (req, res) => {

    console.log(req.body);

    var newTodo = new Todo({
        text: req.body.text,
    });

    newTodo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err); 
    }).catch(err => console.error(err));
});

app.get('/todos', (req, res) => {

    Todo.find({}).then((todos) => {
        res.send({todos});
    },(err) => {
        res.status(400).send(err); 
    }).catch(err => console.error(err));
});

app.get('/todos/:id', (req, res) => {

    let id = req.params.id;
    if( !ObjectId.isValid(id) ){
        res.status(404).send({error: 'Could not find that ish...'}); 
    }

    Todo.findById(id)
    .then((todo) => {
        if(!todo) res.status(404).send({error: 'Could not find that ish...'}); 
        else res.send({todo});
    }).catch((err) => {
        res.status(400).send({error: 'Bad shit happened...'})
    }); 
});

module.exports = { app };

app.listen(port, () => {
    console.log(`started app on port ${port}...`);
});