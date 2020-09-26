import mongoose from 'mongoose'

const roomsSchema= mongoose.Schema({
    roomName: String,
    messages: [{
        name: String,
        message: String,
        timestamp: String,
    }]
})

export default mongoose.model('Rooms', roomsSchema)