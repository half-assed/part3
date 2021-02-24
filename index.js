require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())
app.use(express.static('build'))      // frontend build

// 3.8
/* morgan.token('data', function(req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data')) */

// 3.5
app.post('/api/persons', (request, response, next) => {
  console.log(">>> POST - /api/persons")
  //console.log("request", typeof request.body.name)
  // wouldn't work until request.body.name is put inside of `${}`, fucking unbelievable...
  Person.find({name: `${request.body.name}`}).then(result => {
    console.log("Result", result)
    if(result.length > 0) {
      console.log("Person exists in phonebook: ")
      response.status(400).send({ error: 'name must be unique' })
    }
    //else if (request.body.name !== "" && request.body.number !== "") {
    else {
      const newPerson = new Person({
        name: request.body.name,
        number: request.body.number
      })
      console.log("newPerson:", newPerson.name, newPerson.number)
      newPerson.save().then(result => {
        console.log("Save: ", result)
        response.json(result)
      }).catch(error => next(error))
    }
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  console.log(`>>> PUT - /api/persons/${request.params.id}`)
  // const newPerson = new Person --- will not work!!! new Person will already be an object created by the model, and the findByIdAndUpdate method takes plain JS objects!!!
  const placeholderPerson = {
      number: request.body.number
  }
  // search person from database
  Person.find({}).then(result => {
    Person.findByIdAndUpdate(request.params.id, placeholderPerson, {new: true})
    .then(updatedPerson => {
      console.log("response.json")
      return response.json(updatedPerson)
    }).catch(error => next(error))
  })
})

// 3.13
app.get('/api/persons', (request, response, next) => {
  console.log(">>> GET - /api/persons")
  Person.find({}).then(result => {
    response.json(result)
  })
  .catch(error => next(error))

})

// 3.2
app.get('/info', (request, response) => {
    Person.countDocuments({}).then(result => {response.send(`<p>Phonebook has info for ${result} people</p><p>${new Date()}`)}
)})

// 3.3
app.get('/api/persons/:id', (request, response, next) => {
  console.log("Route: /api/persons/:id")

  Person.find({}).then(result => {
    const person = result.find(person => person._id.equals(request.params.id))
    if (person)
      response.json(person)
    else
      response.status(404).end()
  })
  .catch(error => next(error))


})

// 3.4
app.delete('/api/persons/:id', (request, response, next) => {
  console.log(">>> DELETE - /api/persons")
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log("An error occured:")
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if(error.name === 'ValidationError') {
    return response.status(500).send({error: `${error}`})
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`-----Server running on port ${PORT}-----`)
})