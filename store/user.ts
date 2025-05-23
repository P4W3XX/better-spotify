import {create} from 'zustand';

interface UserState {
  username: string;
  email: string;
}

export const useUserStore=create((set)=>({
    currentUser:{
        username:"",
        email:"",
    },
    setCurrentUser: (user: UserState) =>
        set({currentUser: user})
})) 