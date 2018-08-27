// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

let obj = new ObjectID();
console.log(obj);

// let user = {name: 'al', age: 30};
// let {name} = user; // object destructuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', 
    (err, db) => {

        if(err) return console.log('Couldn\'t connect to db...');
        else console.log('Connected to database...');

        // db.collection('Todos').insertOne({

        // }, 
        // (err, result) => {

        //     if(err) return console.log('Couldn\'t insert record...');
        //     else console.log( JSON.stringify(result.ops, undefined, 2) );
        // });

        // db.collection('Users').insertOne({
        //     name: 'Al',
        //     age: 30,
        //     location: 'San Mateo, CA'
        // }, 
        // (err, result) => {

        //     if(err) return console.log('Couldn\'t insert user doc...');
        //     else console.log( JSON.stringify(result.ops, undefined, 2) );
        // });

        db.close();
    });