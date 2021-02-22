require('dotenv').config()
// import the database configuration. Connects and returns mongoose.model('Person', personSchema)
const Person = require('./models/Person')   
const mongoose = require('mongoose')        // required for closing connection


// read in arguments used to specify which action to take
const arguments = process.argv
arguments[2] = arguments[2].toUpperCase()
console.log("ARGUMENTS now contains: ", arguments, "\nand contains", arguments.length, "items\n")

if (arguments[2] === 'LIST' && arguments.length === 3) {
  Person.find({}).then(result => {
      console.log("\nFound the following results:\n--------------")
      result.forEach(pers => {
          console.log(pers.name + " " + pers.number)
      })
      console.log("--------------\n")
      mongoose.connection.close()
  })
}
else if (arguments[2] === 'GET' && arguments.length === 4) {
  console.log(`\nFetching ${arguments[3]} from database`)
  Person.find({ name: arguments[3] }).then(result => {
    result.forEach(element => {
      console.log(`Found: ${element.name} - ${element.number}`)
    })
  })
}
else if (arguments[2] === 'POST' && arguments.length === 5) {
  console.log(`\nFound more than 3 arguments ${arguments.length}`)
  const person = new Person({
      name: arguments[3],
      number: arguments[4]
    })
    
    console.log("Saving person")
    // .save() is an method part of the Person model/schema imported at the top of this file.
    // and 'person' was created from the Person model.
    person.save().then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook\n`)
      mongoose.connection.close()
    })
  }
else {
  console.log("That's odd...")
}