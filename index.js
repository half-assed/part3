const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(express.static('build'))

// 3.8
morgan.token('data', function(req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
        { 
          "name": "Arto Hellas", 
          "number": "040-123456",
          "id": 1
        },
        { 
          "name": "Ada Lovelace", 
          "number": "39-44-5323523",
          "id": 2
        },
        { 
          "name": "Dan Abramov", 
          "number": "12-43-234345",
          "id": 3
        },
        { 
          "name": "Mary Poppendieck", 
          "number": "39-23-6423122",
          "id": 4
        }
]

// 3.1
app.get('/api/persons', (request, response) => {
  response.json(persons)
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
app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(person => person.id !== Number(request.params.id))
    response.status(202).end()
})

// 3.5
app.post('/api/persons', (request, response) => {
    const newPerson = {
        name: request.body.name,
        number: request.body.number,
        id: Math.round(Math.random()*10000)
    }
    // 3.6
    if (newPerson.name !== "" && newPerson.number !== "" && !persons.find(person => person.name === newPerson.name)) {
        persons = persons.concat(newPerson)
        response.json(newPerson)
    }
    else
        response.status(400).send( { error: 'name must be unique' } )

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})