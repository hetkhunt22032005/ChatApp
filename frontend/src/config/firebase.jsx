import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore/lite";
import { toast } from "react-toastify";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFemqnmUEGxcQPLY7W1ohaJc7Y-nyOljs",
  authDomain: "baatcheet-70ef6.firebaseapp.com",
  projectId: "baatcheet-70ef6",
  storageBucket: "baatcheet-70ef6.firebasestorage.app",
  messagingSenderId: "127869796965",
  appId: "1:127869796965:web:83b6712c444a4f90dc3c8c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup function
const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Add user details to Firestore
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, I am using BaatCheet",
      lastSeen: Date.now(),
    });

    // Initialize chats collection for the user
    await setDoc(doc(db, "chats", user.uid), {
      chatData: [],
    });

    toast.success("Account created successfully!");
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};
const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Login failed:", error.message);
    toast.error(`Login failed: ${error.code.split('/')[1].split('-').join(" ")}`);
  }
};

const logout= async()=>{
  try{
     await signOut(auth)
  }catch(error){
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}
export { auth, db, login, logout, signup };
