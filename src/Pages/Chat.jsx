import { useEffect, useState } from "react";
import PageTitle from "../Components/PageTitle";
import { useNavigate, useOutletContext } from "react-router";
import { io } from "socket.io-client";
import axios from "axios";
import './Chat.css';

//connect the socket.io to the backend
const socket = io('http://localhost:3000/', {
    extraHeaders: {
        authorization: `bearer ${localStorage.getItem('jwtToken')}`
    },
    autoConnect: false
})

export default function Chat() {
    const [user, setUser] = useState()
    const [chat, setChat] = useState('')
    const [chatLog, setChatLog] = useState('')

    const navigate = useNavigate()

    const [headerUsername, setHeaderUsername] = useOutletContext()
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

    async function fetchAuth() {
        const token = localStorage.getItem('jwtToken')
        if(token) {
            await axios.get(`${API_BASE_URL}/api/auth`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                setUser(response.data)
                setHeaderUsername(response.data.username)
            }).catch(err => {
                console.error(err.message)
                navigate('/')
            })
        } else {
            navigate('/')
        }
    }

    useEffect(() => {
        socket.connect() //it wont connect with jwt authentication, why???
        //window.location.reload()
        fetchAuth()
        return () => {
            socket.disconnect()
        }
    }, [])

    const sendMessage = (e) => {
        e.preventDefault()
        socket.emit('send chat', {
            senderId: user.id,
            recipientId: '7abe2c3a-8791-484d-9f63-b97e2fa2d276', //John Cena ID
            message: chat
        })
        e.target.reset()
        setChat('')
    }

    useEffect(() => {
        socket.on('received chat', (data) => {
            //alert(data.message)
            setChatLog(data.message)
        })
    }, [socket])

    return(
        <>
        <PageTitle title="Chat | Hardine Chat" />
        {user && (
            <main className="main-chat">
                <div className="friend-list-container">
                    <h2 className="friend-list-title">Contact</h2>
                    <div className="friend-card">Bruce Wayne</div>
                    <div className="friend-card">Clark Kent</div>
                    <div className="friend-card">Harry Potter</div>
                    <div className="friend-card">John Cena</div>
                </div>
                <div className="chat-message-container">
                    <h2>Friend Name</h2>
                    <ul className="messages">
                        <li>test 1</li>
                        <li>test 2</li>
                        <li>test 3</li>
                        {chatLog && <li>{chatLog}</li>}
                    </ul>
                    <form className="chat-form" onSubmit={sendMessage}>
                        <input type="text" id="input" autoComplete="off" onChange={(e) => setChat(e.target.value)} required/>
                        <button>Send</button>
                    </form>
                </div>
            </main>
        )}
        </>
    )
}