import { Avatar, IconButton } from '@material-ui/core'
import { AttachFile, InsertEmoticon, MoreVert, SearchOutlined } from '@material-ui/icons'
import React, { useState, useEffect } from 'react'
import './Chat.css'
import MicIcon from '@material-ui/icons/Mic'
import axios from './axios'
import { useParams } from 'react-router-dom'
import Pusher from 'pusher-js'
import { Picker } from 'emoji-mart'
import "emoji-mart/css/emoji-mart.css"

function Chat({ user }) {
    const [input, setInput]= useState('')
    const [messages, setMessages]= useState([])
    const {roomId}= useParams()
    const [roomName, setRoomName]= useState('')
    const [seed, setSeed]= useState('')
    const [emojiPickerState, SetEmojiPicker] = useState(false)

    let emojiPicker;
    if (emojiPickerState) {
        emojiPicker = (
        <Picker
            style= {{}}
            title="Pick your emoji…"
            emoji="point_up"
            onSelect={emoji => setInput(input + emoji.native)}
        />
        );
        setTimeout(()=> {
            var element = document.getElementById("text")
            element.scrollTop = element.scrollHeight
        }, 1)
    }

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [roomId])

    useEffect(() => {
        axios.get('/rooms/messages', {
            params: {
                roomId: roomId
            }
        })
            .then(res => setMessages(res.data.messages))

        axios.get('/rooms/messages', {
            params: {
                roomId: roomId
            }
        })
            .then(res => setRoomName(res.data.roomName))
        
        var element = document.getElementById("text");
        element.scrollTop = element.scrollHeight;

    }, [roomId])

    useEffect(() => {
        var pusher = new Pusher('6cb299ddcd1cbb18da30', {
            cluster: 'ap2'
        });

        var channel = pusher.subscribe('messages');
        channel.bind('updated', (data) => {
            // alert(JSON.stringify(data));
            setMessages([...messages, data.messages])
        });
        var element = document.getElementById("text");
        element.scrollTop = element.scrollHeight;

        return () => {
            pusher.unsubscribe('messages')
            channel.unbind()
        }
    }, [messages])

    const sendMessage = (e) => {
        e.preventDefault()
        axios.post('/rooms/messages/new', {
            params: {
                roomId: roomId
            },
            messages: {
                message: input,
                name: user.displayName,
                timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            }
        })
        setInput('')   
    }

    const triggerPicker = (e) => {
        e.preventDefault();
        SetEmojiPicker(!emojiPickerState);
      }

    return (
        <div className= 'chat'>
            <div className= 'chat__header'>
                <Avatar 
                src= {`https://avatars.dicebear.com/api/avataaars/${seed}.svg`}
                />

                <div className= 'chat__headerInfo'>
                    <h3>{roomName}</h3>
                    <p>last seen at {messages[messages?.length - 1]?.timestamp}</p>
                </div>

                <div className= 'chat__headerRight'>
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>

            <div id= 'text' className= 'chat__body scrollbar-juicy-peach'>
                {messages?.map(message => (
                    <p key= {message._id} className= {`chat__message ${user.displayName === message.name ? 'chat__receiver' : null}`}>
                        <span className= 'chat__name'>
                            {message.name}
                        </span>

                        {message.message}

                        <span className= 'chat__timestamp'>
                            {message.timestamp}
                        </span>
                    </p>
                ))}
                {emojiPicker}
            </div>
            

            <div className= 'chat__footer'>
                <IconButton onClick= {(e) => triggerPicker(e)}>
                    <InsertEmoticon />
                </IconButton>
                
                <form>
                    <input onChange= {(e) => setInput(e.target.value)} value= {input} placeholder= 'Type a message..' type= 'text' />
                    <button onClick= {sendMessage} type= 'submit'>Send</button>
                </form>
                <MicIcon />
            </div>
        </div>
    )
}

export default Chat
