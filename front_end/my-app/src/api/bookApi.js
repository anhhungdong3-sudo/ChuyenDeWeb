import axios from "axios";
const API = "http://localhost:8080/api/books";
const token = () => localStorage.getItem("token");

export const getAllBooks = () =>
    axios.get(API + "/admin",{
        headers:{
            Authorization:`Bearer ${token()}`
        }
    });

export const createBook = (book)=>
    axios.post(API+"/admin", book,
        { headers:{ Authorization:`Bearer ${token()}` }}
    );