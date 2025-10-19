import { useEffect, useRef, useState } from "react";
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
    const userRef = useRef(user)
    const [chat, setChat] = useState('')
    const [chatLog, setChatLog] = useState('')
    const [searchNewFriendTerm, setSearchNewFriendTerm] = useState('')
    const [newFriendList, setNewFriendList] = useState()
    const [isOpen, setIsOpen] = useState(false)

    const navigate = useNavigate()

    const dialogRef = useRef(null)

    const [headerUsername, setHeaderUsername] = useOutletContext()
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

    async function fetchAuthAndNewFriendList() {
        const token = localStorage.getItem('jwtToken')
        if(token) {
            await axios.get(`${API_BASE_URL}/api/auth`, { //fetch auth
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(async (response) => {
                setUser(response.data)
                userRef.current = response.data
                setHeaderUsername(response.data.username)
                await axios.post(`${API_BASE_URL}/api/new-friend-list`, {userId: response.data.id}) //fetch new friend list
                    .then(response => {
                        setNewFriendList(response.data)
                    }).catch(err => {
                        console.error(err.message)
                    })
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
        fetchAuthAndNewFriendList()
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

    const handleFriendRequest = (newFriendId) => {
        socket.emit('send friend request', {friendRequestId: newFriendId})
    }

    const toggleDialog = () => {
        if(!dialogRef.current) //check if the dialog tag has ref
            return
        if(dialogRef.current.hasAttribute('open')) //check if the dialog tag is opened
            dialogRef.current.close()
        else
            dialogRef.current.showModal()
    }

    useEffect(() => {
        socket.on('received chat', (data) => {
            //alert(data.message)
            setChatLog(data.message)
        })

        socket.on('send friend request', (data) => {
            const friendRequester = data.user
            const friendRequestReceiverId = data.data.friendRequestId
            if(userRef.current.id === friendRequestReceiverId) {
                alert(`${friendRequester.username} wants to be your friend`)
            }
        })
    }, [socket])

    return(
        <>
        <PageTitle title="Chat | Hardine Chat" />
        {user && (
            <main className="main-chat">
                <div className="left-ui-container">
                    <div className="notification-container">
                        <input type="text" value={searchNewFriendTerm} placeholder="Search new friend here..." onChange={(e) => setSearchNewFriendTerm(e.target.value)}/>
                    </div>
                    {searchNewFriendTerm ? (
                        <ul className="new-friend-list-container">
                            {newFriendList.filter(list => list.username.includes(searchNewFriendTerm.toLowerCase())).map((list, i) => (
                                <li key={list.id} className="new-friend-list-card">
                                    <div>{list.firstName} {list.lastName}</div>
                                    <div>@{list.username}</div>
                                    <button onClick={() => handleFriendRequest(list.id)}>Send Friend Request</button>
                                </li>
                            ))}
                        </ul>
                    ) : 
                    <div className="friend-list-container">
                        <div className="friend-card">Bruce Wayne</div>
                        <div className="friend-card">Clark Kent</div>
                        <div className="friend-card">Harry Potter</div>
                        <div className="friend-card">John Cena</div>
                        <div className="friend-card">Peter Parker</div>
                        <button onClick={toggleDialog}>open modal</button>
                        <dialog ref={dialogRef} onClick={(e) => (e.currentTarget === e.target) && toggleDialog()}>
                            <div className="dialog-container">
                                <h2>Notification</h2>
                                <div><b>bruce.wayne</b> wants to be your friend</div>
                                <button onClick={toggleDialog}>close</button>
                            </div>
                        </dialog>
                    </div>
                    }

                </div>
                <div className="right-ui-container">
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