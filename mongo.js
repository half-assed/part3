// to run file: node mongo.js in appropriate directory.
require('dotenv').config()
// import the database configuration. Connects and returns mongoose.model('Person', personSchema)
const Person = require('./models/person')
const mongoose = require('mongoose')        // required for closing connection


// read in arguments used to specify which action to take
// eslint-disable-next-line no-undef
const commandArguments = process.argv
commandArguments[2] = commandArguments[2].toUpperCase()
console.log('ARGUMENTS now contains: ', commandArguments, '\nand contains', commandArguments.length, 'items\n')

if (commandArguments[2] === 'LIST' && commandArguments.length === 3) {
  Person.find({}).then(result => {
    console.log('\nFound the following results:\n--------------')
    result.forEach(pers => {
      console.log(pers.name + ' ' + pers.number)
    })
    console.log('--------------\n')
    mongoose.connection.close()
  })
}
else if (commandArguments[2] === 'GET' && commandArguments.length === 4) {
  console.log(`\nFetching ${commandArguments[3]} from database`)
  Person.find({ name: commandArguments[3] }).then(result => {
    result.forEach(element => {
      console.log(`Found: ${element.name} - ${element.number}`)
    })
  })
}
else if (commandArguments[2] === 'POST' && commandArguments.length === 5) {
  console.log(`\nFound more than 3 arguments ${commandArguments.length}`)
  const person = new Person({
    name: commandArguments[3],
    number: commandArguments[4]
  })

  console.log('Saving person')
  // .save() is an method part of the Person model/schema imported at the top of this file.
  // and 'person' was created from the Person model.
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook\n`)
    mongoose.connection.close()
  })
}
else {
  console.log('That\'s odd...')
}