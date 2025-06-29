import "./Navbar.css";

// Hooks
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Redux
import { logout, reset } from "../slices/authSlice";

// components
import { NavLink, Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { fetchNotifications } from "../services/notificationService";

const Navbar = () => {
  const { auth } = useAuth();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());

    navigate("/login");
  };

  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;


  const handleNotificationClick = () => {
    navigate("/assistentes");
  };

  const [notifications, setNotifications] = useState([]);

useEffect(() => {
  const loadNotifications = async () => {
    const data = await fetchNotifications();
    setNotifications(data);
  };

  if (auth && userData && !userData.isAssistente) {
    loadNotifications();
  }
}, [auth, userData]);


  return (
    <>
      <nav id="nav">
        <div className="centroNav">
        <Link to="/" className="linkLogo">
          <img src="/logo-doc-2.png" alt="DocAgenda" id="logo" />
        </Link>
        <ul id="nav-links">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          {auth &&
          userData &&
          userData.isAssistente !== null &&
          !userData.isAssistente ? (
            <>
              <li>
                <NavLink to="/calendario">Calendario</NavLink>
              </li>
              <li>
                <NavLink to="/lista">Agendamentos</NavLink>
              </li>
              <li>
                <NavLink to="/pacientes">Pacientes</NavLink>
              </li>
              <li>
                <NavLink to="/meu-perfil">Meu Perfil</NavLink> 
              </li>
              <div className="notification-container">
                <div className="notification-icon" onClick={handleNotificationClick}>
                  <img src="/bell.svg" className="bell-icon" alt="Notificações" />
                  {notifications?.length > 0 && (
                    <span className="notification-count">{notifications.length}</span>
                  )}
                </div>
              </div>
              <li>
                <span onClick={handleLogout}>Sair</span>
              </li>
            </>
          ) : userData &&
            userData.isAssistente !== null &&
            userData.isAssistente ? (
            <>
              <li>
                <NavLink to="/calendario">Calendário</NavLink>
              </li>
              <li>
                <NavLink to="/lista">Agendamentos</NavLink>
              </li>
              <li>
                <NavLink to="/pacientes">Pacientes</NavLink>
              </li>
              <li>
                <NavLink to="/medicos">Médicos</NavLink>
              </li>
              <li>
                <span onClick={handleLogout}>Sair</span>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login">Entrar</NavLink>
              </li>
              <li>
                <NavLink to="/register">Cadastro</NavLink>
              </li>
              <li>
                <NavLink to="/about">Sobre</NavLink>
              </li>
            </>
          )}
        </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
