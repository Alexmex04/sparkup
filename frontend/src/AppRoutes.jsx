import { Routes, Route, Navigate } from 'react-router-dom';

import Header from "./components/header.jsx";
import Home from "./pages/headerPages/home.jsx";
import Contact from "./pages/footerPages/contact.jsx";
import FAQ from "./pages/footerPages/FAQ.jsx";
import Roadmaps from './pages/headerPages/roadmaps.jsx';

// Login
import Login from "./pages/headerPages/loginPages/login.jsx";
import Register from "./pages/headerPages/loginPages/register.jsx";
import ForgotPassword from './pages/headerPages/loginPages/forgot-password.jsx';
import ResetPassword from './pages/headerPages/loginPages/reset-password.jsx';

// Profile (layout + subrutas)
import Profile from './pages/headerPages/profilePages/profile.jsx';
import ProfileInfo from './pages/headerPages/profilePages/profileInfo.jsx';
import ProfileEdit from './pages/headerPages/profilePages/profileEdit.jsx';
import ProfileDelete from './pages/headerPages/profilePages/ProfileDelete.jsx';
import ProfileFav from './pages/headerPages/profilePages/profileFav.jsx';
///Paginas relacionadas al admin
import Options from './pages/headerPages/adminOptions/options.jsx';
import AdminUserList from './pages/headerPages/adminOptions/AdminUserList.jsx';

import MiNegocio from './pages/headerPages/minegocioPages/DiagnosticForm.jsx';

export function AppRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/roadmaps" element={<Roadmaps />}/>
        <Route path="/minegocio" element={< MiNegocio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/FAQ" element={<FAQ />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="options" element={<Options />}>
            <Route index element={<AdminUserList />} />
            <Route path="/options/info" element={<AdminUserList />} />
        
        </Route>

        {/* Profile anidado */}
        <Route path="/profile" element={<Profile />}>
          <Route index element={<Navigate to="info" replace />} />
          <Route path="info" element={<ProfileInfo />} />
          <Route path="edit" element={<ProfileEdit />} />
          <Route path="favorites" element={<ProfileFav />} />
          <Route path="delete" element={<ProfileDelete />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}
