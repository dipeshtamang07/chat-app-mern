import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});


app.use(cors());
app.use(express.json());

const users = [
    {
        "userId": "dipesh",
        "name": "Dipesh",
    }
]

const rooms = ["room1", "room2", "room3"]

app.get('/', (req, res) => {
    res.send('<h1>Chat App</h2>');
})

app.post('/user', (req, res) => {
    const { name } = req.body;

    const newUser = {
        userId: crypto.randomUUID(),
        name
    }

    users.push(newUser);

    res.json({ message: "Success", data: newUser });
})

app.post('/room', (req, res) => {
    const { roomName } = req.body;
    if (!rooms.includes(roomName)) {
        rooms.push(roomName);
    }

    res.json({ message: "Success" })
});

app.get('/rooms', (req, res) => {
    res.json({ message: "Success", data: rooms });
})


io.on('connection', (socket) => {
    console.log("👤 A user connected");

    socket.on('joinRoom', (roomName) => {
        socket.join(roomName);
    });

    socket.on('sendMessage', (room, msg) => {
        console.log({ room, msg })
        io.to(room).emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log("✖️ A user disconncted");
    })
})

server.listen(8080, () => {
    console.log("🏃 Server running on port 8080");
})