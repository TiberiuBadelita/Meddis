import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DistributionPage from './components/DistributionPage';
import PreferencesPage from './components/PreferencesPage';
import AccountPage from './components/AccountPage';

function App() {

  return (
    <BrowserRouter >
    <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/allocation" element={<DistributionPage/>}/>
        <Route path="/preferences" element={<PreferencesPage/>}/>
        <Route path="/account" element={<AccountPage/>}/>
        <Route path="*" element={<h1>404: Not Found</h1>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
