import React, { useState } from "react";
import assets from "../../assets/assets";
import useLogin from "../../hooks/useLogin";
import useSignup from "../../hooks/useSignup";
import "./Login.css";
import { Spinner } from "../../components";

export const Login = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [isPassVisible, setPassVisible] = useState(false);
  const { login, loading: isLoggingIn } = useLogin();
  const { signup, loading: isSigningUp } = useSignup();
  const [formProps, setFormProps] = useState(
    currState === "Sign up"
      ? { fullname: "", username: "", password: "", gender: "" }
      : { username: "", password: "" }
  );

  const toggleState = () => {
    setCurrState((prev) => (prev === "Sign up" ? "Login" : "Sign up"));
  };

  const togglePassVisibility = () => {
    setPassVisible((prev) => !prev);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (currState === "Sign up") {
      signup(formProps);
      console.log("Signing up:", { fullname, username, password, gender });
    } else {
      login(formProps);
      console.log("Logging in:", { username, password });
    }
  };

  if (isLoggingIn || isSigningUp) {
    return <Spinner />;
  }

  return (
    <div className="login">
      <img src={assets.logo_big} alt="" className="logo" />

      <form onSubmit={onSubmitHandler} className="login-form">
        <h2>{currState}</h2>
        {currState === "Sign up" && (
          <div className="form-input-container">
            <i className="fi fi-rr-user form-input-icon"></i>
            <input
              onChange={(e) =>
                setFormProps({ ...formProps, fullname: e.target.value })
              }
              defaultValue=""
              type="text"
              placeholder="Full name"
              className="form-input"
              required
            />
          </div>
        )}
        <div className="form-input-container">
          <i className="fi fi-rr-id-card-clip-alt form-input-icon"></i>
          <input
            onChange={(e) =>
              setFormProps({ ...formProps, username: e.target.value })
            }
            defaultValue=""
            type="text"
            placeholder="Username"
            className="form-input"
            required
          />
        </div>
        <div className="form-input-container">
          <div className="pass-input-container">
            <i className="fi fi-rr-key form-input-icon"></i>
            <input
              onChange={(e) =>
                setFormProps({ ...formProps, password: e.target.value })
              }
              defaultValue=""
              type={isPassVisible ? "text" : "password"}
              placeholder="Password"
              className="form-input"
              required
            />
            <i
              className={`fi ${
                isPassVisible ? "fi-rr-eye" : "fi-rr-eye-crossed"
              } pass-icon`}
              onClick={togglePassVisibility}
            ></i>
          </div>
        </div>
        {currState === "Sign up" && (
          <div className="gender-selection">
            <label className="gender-option">
              <input
                type="radio"
                value="Male"
                name="gender"
                onChange={(e) =>
                  setFormProps({ ...formProps, gender: e.target.value })
                }
                checked={formProps.gender === "Male"}
                required
              />
              Male
            </label>
            <label className="gender-option">
              <input
                type="radio"
                value="Female"
                name="gender"
                onChange={(e) =>
                  setFormProps({ ...formProps, gender: e.target.value })
                }
                checked={formProps.gender === "Female"}
                required
              />
              Female
            </label>
          </div>
        )}
        <button type="submit">
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>
        <div className="login-term">
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-forgot">
          <p className="login-toggle">
            {currState === "Sign up"
              ? "Already have an account?"
              : "Create an account?"}
            <span onClick={toggleState}> Click here.</span>
          </p>
        </div>
      </form>
    </div>
  );
};
