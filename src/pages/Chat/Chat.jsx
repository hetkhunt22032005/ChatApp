import React from 'react';
import Chatbox from '../../assets/componants/Chatbox/Chatbox';
import Leftsidebar from '../../assets/componants/Leftsidebar/Leftsidebar';
import Rightsidebar from '../../assets/componants/Rightsidebar/Rightsidebar';
import './Chat.css';
export const Chat = () => {
  return (
    <div className='chat'>
    <div className="chat-container">
    <Leftsidebar/>
    <Chatbox/>
    <Rightsidebar/>
    </div>
    </div>
  )
}
export default Chat;
