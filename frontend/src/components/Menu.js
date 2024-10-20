import React from 'react';
import { Link } from 'react-router-dom';

const Menu = ({ onLogout }) => {
  return (
    <nav>
      <ul>
        <li><Link to="/home">Inicio</Link></li>
        <li><Link to="/profile">Perfil</Link></li>
        <li><Link to="/pricecomparator">Comparador de precios</Link></li>
        <li><button onClick={onLogout}>Cerrar sesión</button></li>
      </ul>
    </nav>
  );
};

export default Menu;
