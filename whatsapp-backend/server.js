//imports
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import Pusher from 'pusher'

import Rooms from './dbRooms.js'


//app config
const app= express()
const port= process.env.PORT || 9000

const pusher = new Pusher({
    appId: '1077514',
    key: '6cb299ddcd1cbb18da30',
    secret: 'e8397152e19a430340fb',
    cluster: 'ap2',
    encrypted: true
});


//middleware
app.use(express.json())
app.use(cors())


//db config
const connection_url= 'mongodb+srv://admin:CkyyBXGEOTG94txJ@cluster0.2x0ly.mongodb.net/whatsappdb?retryWrites=true&w=majority'

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db= mongoose.connection

db.once('open', () => {
    console.log('DB Connected')

    const msgCollection_= db.collection('rooms')
    const changeStream_= msgCollection_.watch()

    changeStream_.on('change', (change) => {
        if (change.operationType === 'insert') {                                    //If anything is inserted in collection
            const messageDetails= change.fullDocument
            pusher.trigger('rooms', 'inserted', {
                _id: messageDetails._id,
                roomName: messageDetails.roomName,
                messages: messageDetails.messages
            })
        }
        else if (change.operationType === 'update') {                             //If anything is updated in collection
            Rooms.findById(change.documentKey._id, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    const LENGTHM= data.messages.length - 1
                    pusher.trigger('messages', 'updated', {
                        messages: data.messages[LENGTHM]
                    })
                } 
            })
        } 
        else {
            console.log('Error triggering pusher') 
        }

    })
})


//api routes

app.get('/rooms/sync', (req, res) => {
    
    Rooms.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
    
})

app.post('/rooms/new', (req, res) => {
    const dbRoom= req.body

    Rooms.create(dbRoom, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.get('/rooms/messages', (req, res) => {
    const roomId= req.query.roomId

    Rooms.findById(roomId, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.post('/rooms/messages/new', (req, res) => {
    const message= req.body.messages

    Rooms.findByIdAndUpdate( req.body.params.roomId, {$push :{"messages": message}}, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})


//listen
app.listen(port, () => console.log(`Listening on localhost:${port}`))