const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  { 
    id: 1,
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: 3,
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<div>Phonebook backend</div>')
})

app.get('/info', (request, response) => {
  const personsInfo = `<div>Phonebook has info for ${persons.length} people</div>`
  const date = `<div>${new Date().toString()}</div>`
  const info = personsInfo.concat(date)
  response.send(info)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.statusMessage = "Person not found.";
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => Math.floor(Math.random() * 1000)

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name missing.' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'Number missing.' 
    })
  }

  const nameArr = persons.map(person => person.name.toLowerCase())
  const hasRepeatedName = nameArr.includes(body.name.toLowerCase())

  if (hasRepeatedName) {
    return response.status(400).json({ 
      error: 'Name must be unique.' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})