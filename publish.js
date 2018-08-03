const {amqpKey, queueName} = require('./config');
const open = require('amqplib').connect(amqpKey);

open
    .then(connection => connection.createChannel())
    .then(channel => 
        channel
            .assertQueue(queueName)
            .then(ok => channel.sendToQueue(queueName, Buffer.from('this should contain report Object')))
    )
    .catch(err => {
        console.error(err);
    });
