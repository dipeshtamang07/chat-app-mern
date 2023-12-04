import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Rooms from './pages/Rooms';

function App() {
  return (
    <Router>
      <div className='h-screen'>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/rooms' element={<Rooms />} />
          <Route path='/chat/:room' element={<Chat />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
