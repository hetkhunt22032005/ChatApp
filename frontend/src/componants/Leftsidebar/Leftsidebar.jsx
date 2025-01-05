import React from 'react';
import assets from '../../assets/assets';
import './Leftsidebar.css';
export const Leftsidebar = () => {
  return (
   <div className='ls'>
     <div className="ls-top">
        <div className="ls-nav">
            <img src={assets.logo} className='logo' alt="" srcset="" />
            <div className="menu">
                <img src={assets.menu_icon} alt="" srcset="" />
                <div className="sub-menu">
                 <div className="edit">
                    <p>Edit Profile</p>
                    </div>   
                    <hr />
                    <div className="log">
                    <p>LogOut</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="ls-search">
            <img src={assets.search_icon} alt="" srcset="" />
            <input type="text" placeholder='Search here'/>
        </div>
     </div>
     <div className="ls-list">
        {
            Array(15).fill("").map((item,index)=>(
                <div key={index}className="friends">
            <img src={assets.profile_img} alt="" srcset="" />
            <div>
                <p>Het Khunt</p>
                <span>Hello, How are you?</span>
            </div>
        </div>
            ))
        }
     </div>
   </div>
  )
}

export default Leftsidebar;



