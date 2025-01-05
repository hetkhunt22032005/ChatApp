import { Chatbox, Leftsidebar, Rightsidebar } from "../../components";
import "./Chat.css";
export const Chat = () => {
  return (
    <div className="chat">
      <div className="chat-container">
        <Leftsidebar />
        <Chatbox />
        <Rightsidebar />
      </div>
    </div>
  );
};
