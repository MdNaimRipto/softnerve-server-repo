const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

// middleware
app.use(express.json())
app.use(cors())

const uri = `${process.env.URI}`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

const run = async () => {
    try {
        const patientsCollection = client.db('Softnerve').collection('patients')

        app.get('/patients', async (req, res) => {
            const query = {}
            const patients = patientsCollection.find(query).sort({ _id: -1 })
            const result = await patients.toArray()
            res.send(result)
        })

        app.get('/updatePatient/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await patientsCollection.findOne(query)
            res.send(result)
        })

        app.patch('/updatedPatient/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const patient = req.body;
            const updatedDoc = {
                $set: {
                    name: patient.name,
                    contact: patient.contact,
                    address: patient.address,
                    pincode: patient.pincode
                }
            }
            const result = await patientsCollection.updateOne(query, updatedDoc)
            res.send(result)
        })

        app.post('/patients', async (req, res) => {
            const patient = req.body;
            const result = await patientsCollection.insertOne(patient)
            res.send(result)
        })

        app.delete("/patients/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await patientsCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally {

    }
}

run().catch(err => console.log(err))

app.get("/", (req, res) => {
    res.send("Server is running successfully")
})


app.listen(port, () => {
    console.log(`Server is running on Port ${port}`)
})
