import './FindFriend.css'

export default function FindFriend({
        setIsFindFriendMode,
        searchNewFriendTerm,
        setSearchNewFriendTerm,
        newFriendList,
        handleFriendRequest,
        friends,
    }) {        
        return (
            <div className="find-friend-component">
                <div className="notification-container">
                    <div>Find Friend</div>
                    <button onClick={() => {setIsFindFriendMode(false); setSearchNewFriendTerm('');}}>Close</button>
                    <input type="text" value={searchNewFriendTerm} placeholder="Search new friend here..." onChange={(e) => setSearchNewFriendTerm(e.target.value)}/>
                </div>
                <br />
                {searchNewFriendTerm ? (
                    newFriendList.filter(list => list.username.includes(searchNewFriendTerm.toLowerCase())).length > 0 ? (
                        <ul className="new-friend-list-container">
                            {newFriendList.filter(list => list.username.includes(searchNewFriendTerm.toLowerCase())).map((list) => {
                                for(let i = 0; i < friends.length; i++) {
                                    console.log(friends[i])
                                }
                                return <li key={list.id} className="new-friend-list-card">
                                    <div className="new-friend-list-card-left-container">
                                        <div>{list.firstName} {list.lastName}</div>
                                        <div>@{list.username}</div>
                                    </div>
                                    <button onClick={() => handleFriendRequest(list.id)}>Send Friend Request</button>
                                </li>
                            })}
                        </ul>
                        ) : (
                            <div>No Match Found</div>
                        )
                    ) : 
                    <div>
                        type the username that you want to befriend
                    </div>
                }
            </div>
        )
}