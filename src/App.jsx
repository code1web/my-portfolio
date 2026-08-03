import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Portfolio from './components/Portfolio';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
