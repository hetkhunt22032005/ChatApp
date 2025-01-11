import { useState } from "react";
import assets from "../../assets";
import "./ProfileUpdate.css";
export const ProfileUpdate = () => {
  const [image, setImage] = useState(false);
  return (
    <div className="profile">
      <div className="profile-container">
        <form>
          <h3>Profile Detail</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              name=""
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt=""
              srcSet=""
            />
            upload profile image
          </label>
          <input type="text" name="" placeholder="your name" id="" required />
          <textarea placeholder="write profile bio"></textarea>
          <button type="submit">Update Profile</button>
        </form>
        <img
          className="profile-pic"
          src={image ? URL.createObjectURL(image) : assets.logo_icon}
          alt=""
          srcSet=""
        />
      </div>
    </div>
  );
};
