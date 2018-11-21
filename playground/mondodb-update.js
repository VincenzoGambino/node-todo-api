const {MongoClient, ObjectID} = require('mongodb');

const url = 'mongodb://localhost:27017';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to Mongo db server');
    }
    console.log('Connected to MondoDB server');

    const db = client.db('TodoApp');

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5b462770b23f53fc14ac2a78')},
        {
            $set: {
                completed: true
            }
        },
        {
            returnOriginal: false
        }).then((results) => {
            console.log(results);
    });
    //client.close();

});
