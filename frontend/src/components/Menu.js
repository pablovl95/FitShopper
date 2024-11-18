import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Menu.css'; // Asegúrate de crear este archivo para los estilos

const Menu = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <input type="text" className="search-bar" placeholder="Buscar..." />
        <li><Link to="/home">Inicio</Link></li>
        <li><Link to="/categories">Categorias</Link></li>
        <li><Link to="/routiner">Rutina</Link></li>
        <li><Link to="/profile">Perfil</Link></li>

      </ul>
    </nav>
  );
};

export default Menu;
