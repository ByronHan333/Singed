import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './CommunityModal.css'
import GroupListItem from './GroupListItem'
import SearchBar from './SearchBar'
import { logout } from '../../../store/session';
import AddToGroupModal from './AddtoGroupModal/AddToGroupModal'
import { fetchUsers, getUsers } from '../../../store/user'



export const openCommunityModal = () => {

    document.getElementById("modal-overlay").style.width = "100vw";
    document.getElementById("modal-menu-content").style.width = "250px";
    // document.getElementById("modal-menu-content").style.display = "inline";
    document.getElementById("modal-menu-content").style.padding = "20px";

    let children = document.querySelectorAll('#modal-menu-content > *'); //this workaround is bc my children does not disappear when modal is gone
    for (let i = 0; i < children.length; i++) {
        children[i].style.display = "inline";
}
}
export const closeCommunityModal = () => {
    document.getElementById("modal-overlay").style.width = "0";
    document.getElementById("modal-menu-content").style.width = "0";
    document.getElementById("modal-menu-content").style.padding = "0";
    let children = document.querySelectorAll('#modal-menu-content > *');
    for (let i = 0; i < children.length; i++) {
        children[i].style.display = "none";
    }
}

const CommunityModal = () => {
    //state for opening add to group modal, delete on refactor
    const [groupList, setGroupList] = useState([])
    const [searchTerms, setSearchTerms] = useState('Find your friends here!')
    const [filteredUsers, setFilteredUsers] = useState([])
    const dispatch = useDispatch()
    const sessionUser = useSelector((store) => store.session.user);
    const allUsers = useSelector(getUsers)
    //We should get a list of peoples names at the very least
    // const friendsList = useSelector(state => state)
    const logoutUser = e => {
        e.preventDefault();
        dispatch(logout());
    }

    const handleOnClick = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        
    }
    const addToGroup = user =>{
       
        if(!groupList.includes(user)) setGroupList([...groupList, user])
    }
    
    const handleSendGroupInvite = () =>{

        // return(<Redirect to={{

        //     }}/>)
    }


    const filterUsers = (searchTerms) =>{
        const res = [];
        
        if(!searchTerms || searchTerms=== 'Find your friends here!')
            return res
        else{
            allUsers.forEach(user=>{   
                if (user?.username.toLowerCase().includes(searchTerms) && user?._id !== sessionUser.user._id ) res.push(user)           //change to user.name.lower() later
            })
            return res
        }
    }


    useEffect(()=>{
        setFilteredUsers(filterUsers(searchTerms))
        if(searchTerms === '') setSearchTerms('Find your friends here!')
    }, [searchTerms])


    useEffect(()=>{
        dispatch(fetchUsers())
    }, [])

   
    
    return (
        <div>
            <div id='modal-overlay' onClick={closeCommunityModal}>
                <div className="modal-menu-container">
                    <div id="modal-menu-content" onClick={e => e.stopPropagation()}>

                        <div id='community-upper'>
                            <div className="modal-profile-content">
                                <h2>{sessionUser.username}</h2>
                            </div>
                            <form>
                                <input id="search-bar" type='text' placeholder={searchTerms} onChange={e =>setSearchTerms(e.target.value)}/>
                            </form>

                            <ul id="search-result-display">
                                {filteredUsers?.map((user, idx) =>
                                <li className='search-bar-result' key={idx} onClick={handleOnClick}>
                                    <span>
                                        {user.username}
                                    </span>
                                    <button id='add-to-group' onClick={()=> addToGroup(user)} value={user}>+</button>
                                </li>
                                )}  
                            </ul>
                        </div>

                        <div id='community-lower'>
                            <ul id='group-list'>
                                {groupList.map((groupMember, idx) =>
                                    <GroupListItem groupMember={groupMember} groupList={groupList} setGroupList={setGroupList}
                                    key={idx}/>
                                    )}
                            </ul>
                            <div id='bottom-buttons'>

                                <button onClick={handleSendGroupInvite}>Send Group Invite</button>
                                <button onClick={logoutUser}>Logout</button>

                            </div>
                           
                        </div>   
                     </div>
                </div>    
            </div>
        </div>
  )
}

export default CommunityModal
