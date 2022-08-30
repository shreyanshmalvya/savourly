import './App.css';
import { Home } from './pages/home/Home';
import ReadPage from './pages/read/ReadPage';
import Login from './pages/login/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Edit from './pages/editPage/Edit';
import Add from './pages/addPage/Add';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/read/" element={<ReadPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/add" element={<Add />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;