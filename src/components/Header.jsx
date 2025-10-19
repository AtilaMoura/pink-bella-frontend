// src/components/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function Header({ toggleSidebar }) {

    // Estilos que dependem das variáveis CSS globais
    const headerStyle = {
        backgroundColor: 'var(--surface-color)', // Fundo do Card/Surface
        color: 'var(--text-color)', // Cor do texto
        position: 'sticky',
        top: 0,
        zIndex: 999,
        transition: 'all 0.3s ease',
        borderRadius: '0 0 15px 15px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        paddingLeft: '30px' // Espaço para não colidir com o sidebar minimizado
    };

    const searchInputStyle = {
        backgroundColor: 'var(--background-color)', // Fundo mais escuro
        borderColor: 'var(--primary-color)',
        color: 'var(--text-color)',
        borderRadius: '25px',
        padding: '10px 20px',
        transition: 'all 0.3s'
    };

    const iconStyle = {
        color: 'var(--primary-color)',
        fontSize: '1.2rem',
        cursor: 'pointer',
        transition: 'color 0.2s'
    };
    
    return (
        <header className="navbar navbar-expand-lg" style={headerStyle}>
            <div className="container-fluid">
                
                {/* Toggle Button */}
                <button 
                    className="btn me-3" 
                    onClick={toggleSidebar}
                    style={{ color: 'var(--primary-color)' }}
                    aria-label="Toggle Sidebar"
                >
                    <i className="fas fa-bars fa-lg"></i>
                </button>

                {/* Search Bar */}
                <form className="d-flex mx-auto w-50">
                    <div className="input-group">
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Buscar..."
                            aria-label="Buscar"
                            style={searchInputStyle}
                        />
                        <button 
                            className="btn" 
                            type="submit"
                            style={{ 
                                backgroundColor: 'var(--primary-color)', 
                                color: 'white',
                                borderRadius: '0 25px 25px 0',
                                border: 'none',
                                marginLeft: '-25px', // Ajuste visual
                                zIndex: 10
                            }}
                        >
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </form>

                {/* Right side - Notifications and Profile */}
                <div className="d-flex align-items-center ms-auto">
                    
                    {/* Notification Bell */}
                    <div className="me-4 position-relative">
                        <i 
                            className="fas fa-bell" 
                            style={iconStyle}
                            onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--primary-color)'}
                        ></i>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            3
                            <span className="visually-hidden">Novas notificações</span>
                        </span>
                    </div>

                    {/* User Profile */}
                    <Link to="/configuracoes" className="d-flex align-items-center text-decoration-none" style={{ color: 'var(--text-color)' }}>
                        <div className="text-end me-3 d-none d-md-block">
                            <small className="d-block fw-bold" style={{ color: 'white' }}>Administrador</small>
                            <small className="text-muted" style={{ fontSize: '0.8rem' }}>admin@sistema.com</small>
                        </div>
                        <img 
                            src="https://via.placeholder.com/40/D81B60/FFFFFF?text=A" 
                            alt="Avatar" 
                            className="rounded-circle border border-2" 
                            style={{ borderColor: 'var(--primary-color)', width: '40px', height: '40px' }} 
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;