import { create } from "zustand";
import { axiosInstance } from "../config/axios";

interface userProps {
    _id: string,
    fullname: string,
    email?: string,
    username: string,
    gender: "male" | "female",
    profilePic: string,
    createdAt: string,
    updatedAt: string,
    __v: number,
}

interface authProps {
    authUser: null | userProps;
    isCheckingAuth: boolean;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<authProps>()((set) => ({
    authUser: null,
    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/me");
            set({authUser: response.data});
        } catch (error) {
            
            console.log("Error in checkAuth: ", error);
        } finally{
            set({isCheckingAuth: false});
        }
    },
}));
