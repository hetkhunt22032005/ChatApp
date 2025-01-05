import React from 'react';
import assets from '../../assets/assets';
import './Chatbox.css';
export const Chatbox = () => {
  return (
    <div>
      <div className="chat-box">
        <div className="chat-user">
          <img src={assets.profile_img} alt="" srcset="" />
          <p>Het Khunt<img src={assets.green_dot} className='dot'></img></p>
          <img src={assets.help_icon} alt="" srcset="" className='help' />
        </div>
        <div className="chat-msg">
          <div className="s-msg">
            <p className="msg">
              Lorem ipsum dolor sit amet.
            </p>
            <div>
              <img src={assets.profile_img} alt="" srcset="" />
              <p>2:30 PM</p>
            </div>
          </div>

          <div className="s-msg">
          <img className='msg-img' src={assets.pic1} alt="" srcset="" />
            <div>
              <img src={assets.profile_img} alt="" srcset="" />
              <p>2:30 PM</p>
            </div>
          </div>

          <div className="r-msg">
            <p className="msg">
              Lorem ipsum dolor sit amet.
            </p>
            <div>
              <img src={assets.profile_img} alt="" srcset="" />
              <p>2:30 PM</p>
            </div>
          </div>
        </div>
        <div className="chat-input">
        <input type="text" placeholder='send a message'/>
        <input type="file" name="" id="image" accept='image/png,image/jpeg' hidden/>
        <label htmlFor="image">
          <img src={assets.gallery_icon
          } alt="" srcset="" />
        </label>
        <img src={assets.send_button} alt="" srcset="" />
      </div>
      </div>
    </div>
  )
}

export default Chatbox;