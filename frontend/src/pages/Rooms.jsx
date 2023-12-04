import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function Rooms() {
    const { user } = useUser();
    const [rooms, setRooms] = useState(["room1", "room2"]);

    useEffect(() => {
        axios.get("http://localhost:8080/rooms")
            .then(res => {
                if (res.data?.data) {
                    setRooms(res.data.data);
                }
            })
    }, []);

    const navigate = useNavigate();

    const handleJoinRoom = (roomName) => {
        navigate(`/chat/${roomName}`);
    };


    if (rooms && rooms.length === 0) {
        return <p className="text-gray-500">No rooms found.</p>
    }

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1>{user?.name}</h1>
            <h2 className="text-2xl font-semibold mb-4">Room List</h2>
            <ul className="divide-y divide-gray-300">
                {rooms.map((roomName) => (
                    <li key={roomName} className="py-2">
                        <div className="flex items-center justify-between">
                            <span className="text-lg">{roomName}</span>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => handleJoinRoom(roomName)}
                            >
                                Join
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Rooms;