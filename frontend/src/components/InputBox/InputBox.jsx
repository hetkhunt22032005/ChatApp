import React, { useState } from "react";
import assets from "../../assets";
import "./InputBox.css";
export const InputBox = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Save the base64 string of the image
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const sendMessage = () => {
    if (image) {
      console.log("Sending image:", image);
      // Add your send logic here
      setImage(null);
    } else {
      console.log("Sending text message");
      // Add your send logic here
    }
  };

  return (
    <div>
    <form action="" onSubmit={()=>{

    }}>
      {/* Image Preview Section */}
      {image && (
        <div className="image-preview">
          <img src={image} alt="Preview" className="preview-image" />
          <button className="remove-button" onClick={removeImage}>
            &#x2715; {/* Cross Icon */}
          </button>
        </div>
      )}
      <div className="chat-input">
        <input type="text" placeholder="Send a message" />
        <input
          type="file"
          id="image"
          accept="image/png,image/jpeg"
          hidden
          onChange={handleImageChange}
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="Select" />
        </label>
        <img src={assets.send_button} alt="Send" onClick={sendMessage} />
        
      </div>
           </form>
    </div>
  );
};
