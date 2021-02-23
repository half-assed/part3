require('dotenv').config()
const Person = require("./models/person")
const express = require('express')
const app = express()
// const morgan = require('morgan')
const mongoose = require('mongoose')
const person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))      // frontend build

// 3.8
/* morgan.token('data', function(req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data')) */

// 3.5
app.post('/api/persons', (request, response) => {
  console.log(">>> POST - /api/persons")
  const newPerson = new Person({
      name: request.body.name,
      number: request.body.number,
  })
  // 3.14
  if (newPerson.name !== "" || newPerson.number !== "") {
      newPerson.save().then(result => {
        console.log("Save: ", result)
        response.json(result)
      }).catch(error => {
        console.log(">>>ERROR<<< Saving failed: \n", error)
      })
  }
  else
      response.status(400).send( { error: 'name must be unique' } )
})

// 3.13
app.get('/api/persons', (request, response) => {
  console.log(">>> GET - /api/persons")
  Person.find({}).then(result => {
    response.json(result)
  })
  .catch(error => {
    console.log(">>> ERROR <<<", error)
  })

})

// 3.2
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}`)
})

// 3.3
app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(person => person.id === Number(request.params.id))
    if (person)
        response.json(person)
    else
        response.status(404).end()
})

// 3.4
app.delete('/api/persons/:id', (request, response, next) => {
  console.log(">>> DELETE - /api/persons")
  person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  }).catch(error => {console.log(">>>ERROR<<<", error)})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`-----Server running on port ${PORT}-----`)
})