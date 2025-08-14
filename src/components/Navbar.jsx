// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Detectar scroll para efeito de transparência
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar menu mobile ao navegar
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: 'fas fa-home' },
    { path: '/clientes', label: 'Clientes', icon: 'fas fa-users' },
    { path: '/compras', label: 'Compras', icon: 'fas fa-shopping-cart' },
    { path: '/frete', label: 'Frete', icon: 'fas fa-truck' }
  ];

  return (
    <>
      <nav 
        className={`navbar navbar-expand-lg fixed-top transition-all duration-300 ${
          isScrolled 
            ? 'navbar-dark shadow-lg' 
            : 'navbar-dark shadow-sm'
        }`}
        style={{
          background: isScrolled 
            ? 'linear-gradient(135deg, rgba(255, 20, 147, 0.95) 0%, rgba(255, 105, 180, 0.95) 100%)'
            : 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        <div className="container-fluid px-4">
          {/* Brand */}
          <Link 
            className="navbar-brand d-flex align-items-center fw-bold fs-4" 
            to="/"
            style={{
              color: 'white',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.textShadow = 'none';
            }}
          >
            <div 
              className="d-flex align-items-center justify-content-center rounded-circle me-3"
              style={{
                width: '45px',
                height: '45px',
                background: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
            >
              <i className="fas fa-heart text-danger fa-lg"></i>
            </div>
            <span style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              Pink Bella CRM
            </span>
          </Link>

          {/* Mobile Toggle Button */}
          <button 
            className="navbar-toggler border-0 p-2"
            type="button" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-controls="navbarNav" 
            aria-expanded={isMenuOpen} 
            aria-label="Toggle navigation"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Menu */}
          <div 
            className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} 
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto align-items-lg-center">
              {navItems.map((item, index) => (
                <li key={index} className="nav-item mx-1">
                  <Link 
                    className={`nav-link d-flex align-items-center px-3 py-2 fw-bold position-relative ${
                      isActiveRoute(item.path) ? 'active' : ''
                    }`}
                    to={item.path}
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '20px',
                      transition: 'all 0.3s ease',
                      background: isActiveRoute(item.path) 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'transparent',
                      backdropFilter: isActiveRoute(item.path) ? 'blur(10px)' : 'none',
                      border: isActiveRoute(item.path) 
                        ? '1px solid rgba(255, 255, 255, 0.3)' 
                        : '1px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActiveRoute(item.path)) {
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActiveRoute(item.path)) {
                        e.target.style.background = 'transparent';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <i className={`${item.icon} me-2`}></i>
                    <span>{item.label}</span>
                    
                    {/* Active Indicator */}
                    {isActiveRoute(item.path) && (
                      <div 
                        className="position-absolute bottom-0 start-50 translate-middle-x"
                        style={{
                          width: '6px',
                          height: '6px',
                          background: 'white',
                          borderRadius: '50%',
                          boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                        }}
                      ></div>
                    )}
                  </Link>
                </li>
              ))}
              
              {/* User Profile/Actions */}
              <li className="nav-item ms-3">
                <div className="d-flex align-items-center gap-2">
                  {/* Notification Bell */}
                  <button 
                    className="btn btn-link text-white p-2 position-relative"
                    style={{
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <i className="fas fa-bell"></i>
                    <span 
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: '0.6rem' }}
                    >
                      3
                    </span>
                  </button>

                  {/* User Avatar */}
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className="fas fa-user text-dark"></i>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Spacer para compensar navbar fixed */}
      <div style={{ height: '80px' }}></div>

      {/* Overlay para menu mobile */}
      {isMenuOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1040 }}
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Navbar;