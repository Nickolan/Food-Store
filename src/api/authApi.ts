import axios from "axios";

export async function login(data: {email: string, password: string}) {

    const response = await axios.post("/users/login", data)
    return response.data
    
}