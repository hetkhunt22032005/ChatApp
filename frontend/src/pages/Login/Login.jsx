// import React, { useState, useEffect } from "react";
// import assets from "../../assets/assets";
// // import { login, signup } from "../../config/firebase";
// // import useLogin from "../../hooks/useLogin";
// // import useSignup from "../../hooks/useSignup";
// import "./Login.css";
// export const Login = () => {
//   // const { login, loading: isLoggingIn } = useLogin();
//   // const { signup, loading: isSigningUp } = useSignup();
//   const [currState, setCurrState] = useState("Sign up");
//   const [fullname, setFullName] = useState("");
//   const [username, setUserName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isPassVisible, setPassVisible] = useState(false);
//   const [gender, setGender] = useState("");
//   const toggleState = () => {
//     if (currState === "Sign up") setCurrState("Login");
//     else setCurrState("Sign up");
//   };

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();
//     if (currState === "Sign up") {
//       try {
//         await signup(fullname, username, password, gender);
//       } catch (error) {
//         console.error("Signup failed:", error);
//       }
//     } else {
//       login({ username: email, password });
//     }
//   };
//   const togglePassVisibility = () => {
//     setPassVisible((prev) => !prev);
//   };

//   function LoginPage() {
//     const [pageLoading, setPageLoading] = useState(true); 
//     const [isLoggingIn, setIsLoggingIn] = useState(false);
//     const [isSigningUp, setIsSigningUp] = useState(false);
  
//     useEffect(() => {
//       setTimeout(() => setPageLoading(false), 2000); 
//     }, []);
  
//     const onSubmitHandler = (e) => {
//       e.preventDefault();
//       if (currState === "Login") {
//         setIsLoggingIn(true);
//         setTimeout(() => setIsLoggingIn(false), 2000); 
//       } else {
//         setIsSigningUp(true);
//         setTimeout(() => setIsSigningUp(false), 2000); 
//       }
//     };
  
//     if (pageLoading) {
//       return (
//         <div className="loader-container">
//           <div className="spinner"></div>
//         </div>
//       );
//     }
  

//   return (
//     <div className="login">
//       <img src={assets.logo_big} alt="" className="logo" srcSet="" />
//       {isLoggingIn || isSigningUp ? (
//         <div className="loader-container">
//         <div className="spinner"></div>
//         </div>
//       ) : (
//       <form onSubmit={onSubmitHandler} className="login-form">
//         <h2>{currState}</h2>
//         {currState === "Sign up" ? (
//           <div className="form-input-container">
//             <i className="fi fi-rr-user form-input-icon"></i>
//           <input
//             onChange={(e) => {
//               setFullName(e.target.value);
//             }}
//             defaultValue=""
//             type="text"
//             placeholder="Full name"
//             className="form-input"
//             required
//           />
//         </div>
//         ) : null}
        
//         <div className="form-input-container">
//           <i className="fi fi-rr-user form-input-icon"></i>
//         {/* <i className="fi fi-rr-envelope form-input-icon"></i> */}
//         <input
//           onChange={(e) => setUserName(e.target.value)}
//           defaultValue=""
//           type="text"
//           placeholder="Username"
//           className="form-input"
//           required
//         />
//         </div>
//         <div className="form-input-container">
//           <i className="fi fi-rr-key form-input-icon"></i>
//         <div className="pass-input-container">
//         <input
//           onChange={(e) => {
//             setPassword(e.target.value);
//           }}
//           defaultValue=""
//           type={isPassVisible ? "text" : "password"}
//           placeholder="password"
//           className="form-input"
//           required
//         />
//         <i
//           className={`fi ${isPassVisible ? "fi-rr-eye" : "fi-rr-eye-crossed"} pass-icon`}
//           onClick={togglePassVisibility}
//         ></i>
//         </div>
//         </div>
//         {currState === "Sign up" ? (
//           <div className="gender-selection">
//             <label className="gender-option">
//               <input
//                 type="radio"
//                 value="Male"
//                 name="gender"
//                 onChange={(e) => setGender(e.target.value)}
//                 required
//               />
//               Male
//             </label>
//             <label className="gender-option">
//               <input
//                 type="radio"
//                 value="Female"
//                 name="gender"
//                 onChange={(e) => setGender(e.target.value)}
//                 required
//               />
//               Female
//             </label>
//           </div>
//         ) : null}
//         <button type="submit">
//           {currState === "Sign up" ? "create Account" : "Login now"}
//         </button>
//         <div className="login-term">
//           <input type="checkbox" required />
//           <p>Agree to the terms of use & privacy policy.</p>
//         </div>
//         <div className="login-forgot">
//           <p className="login-toggle">
//             {currState === "Sign up"
//               ? "Already have an account ?,"
//               : "Create an account ?,"}
//             <span onClick={toggleState}>click here.</span>
//           </p>
//         </div>
//       </form>
//   )}
//     </div>
//   );
// };
// }

import React, { useState, useEffect } from "react";
import assets from "../../assets/assets";
import "./Login.css";

export const Login = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullname, setFullName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPassVisible, setPassVisible] = useState(false);
  const [gender, setGender] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTimeout(() => setPageLoading(false), 1000);
  }, []);

  

  const toggleState = () => {
    if (currState === "Sign up") setCurrState("Login");
    else setCurrState("Sign up");
  };

  const togglePassVisibility = () => {
    setPassVisible((prev) => !prev);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (currState === "Sign up") {
        console.log("Signing up:", { fullname, username, password, gender });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        console.log("Logging in:", { username, password });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="login">
      <img src={assets.logo_big} alt="" className="logo" />
      {isSubmitting ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <form onSubmit={onSubmitHandler} className="login-form">
          <h2>{currState}</h2>
          {currState === "Sign up" && (
            <div className="form-input-container" >
              <i className="fi fi-rr-user form-input-icon"></i>
              <input
                onChange={(e) => setFullName(e.target.value)}
                value={fullname}
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
              onChange={(e) => setUserName(e.target.value)}
              value={username}
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
                onChange={(e) => setPassword(e.target.value)}
                value={password}
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
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                Male
              </label>
              <label className="gender-option">
                <input
                  type="radio"
                  value="Female"
                  name="gender"
                  onChange={(e) => setGender(e.target.value)}
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
      )}
    </div>
  );
};
