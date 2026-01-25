import {create} from 'zustand'

export const useAuthStore=create((set)=>({
    authUser: {name:"sameer",_id:"12345"},
    isLoading:false,

    login: ()=>{
        console.log("currently you are loggined")
    }
}))