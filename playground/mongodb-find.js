const {MongoClient, ObjectID} = require('mongodb');

const url = 'mongodb://localhost:27017';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to Mongo db server');
    }
    console.log('Connected to MondoDB server');

    const db = client.db('TodoApp');

    db.collection('Todos').find({completed: false}).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    //client.close();

});
