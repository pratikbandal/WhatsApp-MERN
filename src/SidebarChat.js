import { Avatar } from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import './SidebarChat.css'
import axios from './axios'
import { Link } from 'react-router-dom'
import Pusher from 'pusher-js'

function SidebarChat({ addNewChat, name, id}) {
    const [messages, setMessages]= useState([])
    const [flag, setFlag]= useState(false)
    const [seed, setSeed]= useState('')

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [])

    useEffect(() => {
        if (id) {
            axios.get('/rooms/messages', {
                params: {
                    roomId: id
                }
            })
                .then(res => setMessages(res.data.messages))
        }
    }, [id, flag])

    useEffect(() => {
        var pusher = new Pusher('6cb299ddcd1cbb18da30', {
            cluster: 'ap2'
        });

        var channel = pusher.subscribe('messages');
        channel.bind('updated', (data) => {
            // alert(JSON.stringify(data));
            setFlag(!flag)
        });

        return () => {
            pusher.unsubscribe('messages')
            channel.unbind()
        }
    }, [flag])

    const createChat = e => {
        e.preventDefault()
        const roomName= prompt('Enter the room name')

        if (roomName) {
            axios.post('/rooms/new', {
                roomName: roomName
            })
        }
    }

    return (
        !addNewChat ? (
            <Link to= {`/rooms/${id}`}>
                <div className= 'sidebarChat'>
                    <Avatar
                    src= {`https://avatars.dicebear.com/api/avataaars/${seed}.svg`}/>
                    <div className= 'sidebarChat__info'>
                        <h2>{name}</h2>
                        <p>{messages[messages.length - 1]?.message}</p>
                    </div>
                </div>
            </Link>
        ): (
            <div onClick= {createChat} className= 'sidebarChat text-center'>
                <h2>Add New Chat</h2>
            </div>
        )
        
    )
}

export default SidebarChat
