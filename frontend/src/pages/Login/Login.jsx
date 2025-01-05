import { useState } from "react";
import assets from "../../assets/assets";
import { login, signup } from "../../config/firebase";
import "./Login.css";
export const Login = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toggleState = () => {
    if (currState === "Sign up") setCurrState("Login");
    else setCurrState("Sign up");
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (currState === "Sign up") {
      try {
        await signup(userName, email, password);
      } catch (error) {
        console.error("Signup failed:", error);
      }
    } else {
      login(email, password);
    }
  };

  return (
    <div className="login">
      <img src={assets.logo_big} alt="" className="logo" srcSet="" />
      <form onSubmit={onSubmitHandler} className="login-form">
        <h2>{currState}</h2>
        {currState === "Sign up" ? (
          <input
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            value={userName}
            type="text"
            placeholder="Username"
            className="form-input"
            required
          />
        ) : null}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email address"
          className="form-input"
          required
        />
        <input
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          type="password"
          placeholder="password"
          className="form-input"
          required
        />
        <button type="submit">
          {currState === "Sign up" ? "create Account" : "Login now"}
        </button>
        <div className="login-term">
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-forgot">
          <p className="login-toggle">
            {currState === "Sign up"
              ? "Already have an account ?,"
              : "Create an account ?,"}
            <span onClick={toggleState}>click here.</span>
          </p>
        </div>
      </form>
    </div>
  );
};
