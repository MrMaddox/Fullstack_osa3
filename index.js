const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('daTa', function getResponse (res) {
    if (JSON.stringify(res.body) === '{}') {
        return ""
    }

    return JSON.stringify(res.body)
    
})

app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :daTa"))

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
      },
]

app.get('/', (req, res) => {
    res.send('<h1>Osa 3</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(
        `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        </div`)
    res.send()
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    
    res.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
    
    for (let i = 0; i < persons.length; i++) {
        if (body.name === persons[i].name) {
            return res.status(400).json({
                error: 'name must be unique'
            })
        }
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    
    persons = persons.concat(person)

    res.json(person)
})

const PORT = 3004
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})