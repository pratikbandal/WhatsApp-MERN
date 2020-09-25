import { Avatar, IconButton } from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import './Sidebar.css'
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from '@material-ui/icons';
import SidebarChat from './SidebarChat';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { auth } from './firebase';
import axios from './axios'
import Pusher from 'pusher-js'

function Sidebar({ setUser }) {
    const [rooms, setRooms]= useState([])
    const [anchorEl, setAnchorEl]= useState(null);
    const open = Boolean(anchorEl);
    const [searchChat, setSearchChat]= useState('')

    useEffect(() => {
        axios.get('rooms/sync')
            .then(res => {
                setRooms(res.data)
            })
    }, [])

    useEffect(() => {
        var pusher = new Pusher('6cb299ddcd1cbb18da30', {
            cluster: 'ap2'
        });

        var channel = pusher.subscribe('rooms');
        channel.bind('inserted', (data) => {
            // alert(JSON.stringify(data));
            setRooms([data, ...rooms])
        });

        return () => {
            pusher.unsubscribe('rooms')
        }
    }, [rooms])

    const handleLogout = e => {
        e.preventDefault()
        auth.signOut()
        setUser(null)
        setAnchorEl(null)
    }

    const handleClick = e => {
        e.preventDefault()
        setAnchorEl(e.currentTarget)

    }

    let filteredRooms= rooms.filter((room) => {
        return room.roomName.indexOf(searchChat) !== -1
    })

    return (
        <div className= 'sidebar'>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                open={open}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    style: {
                    width: '20ch',
                    },
                }}
            >
            <MenuItem onClick={handleLogout}>
                Logout
            </MenuItem>
            </Menu>

            <div className= 'sidebar__header'>
                <Avatar
                src= "https://scontent.fbom3-1.fna.fbcdn.net/v/t1.0-9/81353513_2661048473990323_5341253932402343936_n.jpg?_nc_cat=110&_nc_sid=09cbfe&_nc_ohc=s9Dff29Ipe4AX89jHXy&_nc_ht=scontent.fbom3-1.fna&oh=099f6f7be1610959b99b2f65e248ba4e&oe=5F9534D4"
                />
                <div className= 'sidebar__headerRight'>
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true"onClick= {handleClick}>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className= 'sidebar__search'>
                <div className= 'sidebar__searchContainer'>
                    <SearchOutlined />
                    <input onChange= {(e) => setSearchChat(e.target.value)} type= 'text' placeholder= 'Search...'/>
                </div>
            </div>

            <div className= 'sidebar__chats scrollbar-juicy-peach'>
                <SidebarChat addNewChat/>
                {filteredRooms.map(room => (
                    <SidebarChat key= {room._id} id= {room._id} name= {room.roomName} />
                ))}
            </div>
        </div>
    )
}

export default Sidebar
