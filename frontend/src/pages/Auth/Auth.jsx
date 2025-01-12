import { useState } from "react";
import assets from "../../assets";
import useLogin from "../../hooks/useLogin";
import useSignup from "../../hooks/useSignup";
import "./Auth.css";
import { Spinner, AnimationWrapper } from "../../components";

export const Auth = () => {
  const [currState, setCurrState] = useState("Login");
  const [isPassVisible, setPassVisible] = useState(false);
  const { login, loading: isLoggingIn } = useLogin();
  const { signup, loading: isSigningUp } = useSignup();
  const [formProps, setFormProps] = useState(
    currState === "Sign Up"
      ? { fullname: "", username: "", password: "", gender: "" }
      : { username: "", password: "" }
  );

  const toggleState = () => {
    setCurrState((prev) => (prev === "Sign Up" ? "Login" : "Sign Up"));
  };

  const togglePassVisibility = () => {
    setPassVisible((prev) => !prev);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (currState === "Sign Up") {
      signup(formProps);
    } else {
      login(formProps);
    }
  };

  if (isLoggingIn || isSigningUp) {
    return <Spinner />;
  }

  return (
    <div className="login">
      <img src={assets.logo_big} alt="" className="logo" />
      <AnimationWrapper keyValue={currState}>
      <form onSubmit={onSubmitHandler} className="login-form">
        <h2>{currState}</h2>
        {currState === "Sign Up" ? (
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
        ) : null}
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
        {currState === "Sign Up" ? (
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
        ) : null}
        <button type="submit">
          {currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>
        {currState === "Sign Up" ? (
          <div className="login-term">
            <input type="checkbox" required />
            <p>Agree to Terms and Conditions.</p>
          </div>
        ) : null}
        <div className="login-forgot">
          <p className="login-toggle">
            {currState === "Sign Up"
              ? "Already have an account?"
              : "Create an account?"}
            <span onClick={toggleState}> Click here.</span>
          </p>
        </div>
      </form>
      </AnimationWrapper>
    </div>
  );
};
