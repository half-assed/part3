// This is a module for database configuration,
// i.e. we connect to the database and define the form of the data sent to it

// load mongoose module (so that we can connect)
const mongoose = require('mongoose')


// get url from the environment variables document
const url = process.env.MONGODB_URI
console.log('connecting to: ', url)


// connect, add event handlers for successful/unsuccessful attempt
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => {
    console.log('connected to MongoDB')
})
.catch(result => {
    console.log('failed to connect to MongoDB. Error: ', error.message)
})

// defining database schema
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        required: true
    }
})

// defining the JSON.stringify functionality
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// exporting
module.exports = mongoose.model('Person', personSchema)