import React from 'react';
import Chatbox from '../../componants/Chatbox/Chatbox';
import Leftsidebar from '../../componants/Leftsidebar/Leftsidebar';
import Rightsidebar from '../../componants/Rightsidebar/Rightsidebar';
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
