import React from 'react'
import axios from 'axios'
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { user, setUser } = useUser();
    const [name, setName] = useState("");

    const navigate = useNavigate();

    async function saveUser() {
        try {
            const { data }= await axios.post("http://localhost:8080/user", {
                name
            });
            if (data?.data) {
                setUser(data.data);
                navigate('/rooms');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-2xl font-semibold mb-6">Who are you?</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={saveUser}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Login;