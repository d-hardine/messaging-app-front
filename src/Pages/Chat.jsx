import { useEffect, useRef, useState } from "react";
import PageTitle from "../Components/PageTitle";
import { useNavigate, useOutletContext } from "react-router";
import { io } from "socket.io-client";
import axios from "axios";
import './Chat.css';
import FindFriend from "../Components/FindFriend";

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
    const [friends, setFriends] = useState([])
    const [newFriendList, setNewFriendList] = useState()
    const [isFindFriendMode, setIsFindFriendMode] = useState(false)

    const navigate = useNavigate()

    const friendRequestSentDialogRef = useRef(null)

    const [headerUsername, setHeaderUsername] = useOutletContext()
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

    async function fetchAuthAndFriends() {
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
                await axios.post(`${API_BASE_URL}/api/fetch-friends`, {userId: response.data.id}) //fetch friends
                    .then(fetchFriendsResponse => {
                        setFriends(fetchFriendsResponse.data)
                    }).catch(err => {
                        console.error("Friends Error: " + err.message)
                    })
                await axios.post(`${API_BASE_URL}/api/new-friend-list`, {userId: response.data.id}) //fetch new friend list
                    .then(newFriendsResponse => {
                        setNewFriendList(newFriendsResponse.data)
                    }).catch(err => {
                        console.error("New Friends Error: " + err.message)
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
        fetchAuthAndFriends()
        return () => {
            socket.disconnect()
        }
    }, [])

    const toggleFriendRequestSentDialog = () => {
        if(!friendRequestSentDialogRef.current) //check if the dialog tag has ref
            return
        if(friendRequestSentDialogRef.current.hasAttribute('open')) //check if the dialog tag is opened
            friendRequestSentDialogRef.current.close()
        else
            friendRequestSentDialogRef.current.showModal()
    }

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
        toggleFriendRequestSentDialog()
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
                    <div className="friend-list-container">
                        {friends.map(friend => {
                            if(friend.status === 'added')
                                return <div className="friend-card" key={friend.id}>{friend.friend.firstName} {friend.friend.lastName}</div>
                        })}
                        <button onClick={() => console.log(newFriendList)}>click me</button>
                    </div>
                    <div className="user-profile">
                        <b>{user.firstName} {user.lastName}</b>
                        <br />
                        @{user.username}
                        <button onClick={() => setIsFindFriendMode(true)}>Find Friend</button>
                    </div>
                </div>
                <div className="right-ui-container">
                    {isFindFriendMode ? 
                    <>
                        <FindFriend
                            setIsFindFriendMode={setIsFindFriendMode}
                            searchNewFriendTerm={searchNewFriendTerm}
                            setSearchNewFriendTerm={setSearchNewFriendTerm}
                            newFriendList={newFriendList}
                            handleFriendRequest={handleFriendRequest}
                            friends={friends}
                        />
                        <dialog ref={friendRequestSentDialogRef} onClick={(e) => (e.currentTarget === e.target) && toggleFriendRequestSentDialog()}>
                            <div className="friend-request-dialog-container">
                                <div>Friend Request Sent!</div>
                                <br />
                                <button onClick={toggleFriendRequestSentDialog}>close</button>
                            </div>
                        </dialog>
                    </>
                    :
                    <>
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
                     </>
                    }

                </div>
            </main>
        )}
        </>
    )
}