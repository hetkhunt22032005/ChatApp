import assets from "../../assets";
import "./Rightsidebar.css";
import useLogout from "../../hooks/useLogout";
export const Rightsidebar = () => {
  const { logout } = useLogout();
  return (
    <div className="rs">
      <div className="rs-profile">
        <img src={assets.profile_img} alt="" srcSet="" />
        <h3>
          Het Khunt
          <img src={assets.green_dot} alt="" className="dot" srcSet="" />
        </h3>
        <p>Hey, i am using BaatCheet.</p>
        <hr />
      </div>
      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
        </div>
      </div>
      <div>
        <button onClick={() => logout()}>Log out</button>
      </div>
    </div>
  );
};
