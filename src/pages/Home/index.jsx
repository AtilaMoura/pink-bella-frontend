// src/pages/Home/index.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    // Atualiza o relógio a cada segundo
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Anima os cards após carregamento
    setTimeout(() => setAnimateCards(true), 300);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const cardData = [
    {
      icon: 'fas fa-users',
      title: 'Gerenciar Clientes',
      description: 'Cadastre, edite e visualize todas as informações dos seus clientes com facilidade.',
      primaryLink: '/clientes',
      primaryText: 'Ver Clientes',
      secondaryLink: '/clientes/novo',
      secondaryText: 'Novo Cliente',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      iconColor: 'text-primary',
      delay: '0.1s'
    },
    {
      icon: 'fas fa-shopping-cart',
      title: 'Registrar Compras/Vendas',
      description: 'Registre novas transações e acompanhe todo o histórico de compras dos seus clientes.',
      primaryLink: '/compras',
      primaryText: 'Ver Compras',
      secondaryLink: '/clientes',
      secondaryText: 'Nova Compra',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      iconColor: 'text-success',
      delay: '0.2s'
    },
    {
      icon: 'fas fa-truck',
      title: 'Calcular Frete',
      description: 'Calcule opções de frete para qualquer CEP com base nos produtos selecionados.',
      primaryLink: '/frete',
      primaryText: 'Calcular Frete',
      secondaryLink: null,
      secondaryText: null,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      iconColor: 'text-info',
      delay: '0.3s'
    }
  ];

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #FFE5E5 0%, #FFC5C5 50%, #FFB3BA 100%)",
      minHeight: "100vh"
    }}>
      {/* Header Hero Section */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-lg border-0 mb-5" style={{ 
              background: "linear-gradient(135deg, #FF69B4 0%, #FFB6C1 50%, #FFC0CB 100%)",
              borderRadius: "0 0 30px 30px"
            }}>
              <div className="card-body text-white text-center py-5">
                <div className="mb-4">
                  <i className="fas fa-heart fa-3x mb-3" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}></i>
                  <h1 className="display-3 fw-bold mb-3" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                    Bem-vindo ao Pink Bella CRM!
                  </h1>
                  <p className="lead fs-4 mb-4">
                    Sua plataforma completa para gerenciar clientes, produtos e vendas com amor e profissionalismo.
                  </p>
                </div>
                
                {/* Relógio e Data */}
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <div className="card bg-white bg-opacity-20 border-0" style={{ borderRadius: "20px" }}>
                      <div className="card-body py-3">
                        <div className="row text-center">
                          <div className="col-md-6">
                            <i className="fas fa-clock me-2"></i>
                            <span className="fs-5 fw-bold">{formatTime(currentTime)}</span>
                          </div>
                          <div className="col-md-6">
                            <i className="fas fa-calendar me-2"></i>
                            <span className="fs-6">{formatDate(currentTime)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="container py-5">
        <div className="row justify-content-center g-4">
          {cardData.map((card, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div 
                className={`card h-100 border-0 shadow-lg position-relative overflow-hidden ${animateCards ? 'animate__animated animate__fadeInUp' : ''}`}
                style={{ 
                  borderRadius: "25px",
                  transform: animateCards ? 'translateY(0)' : 'translateY(50px)',
                  opacity: animateCards ? 1 : 0,
                  transition: `all 0.6s ease ${card.delay}`,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
              >
                {/* Gradient Overlay */}
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
                  style={{ 
                    background: card.gradient,
                    borderRadius: "25px"
                  }}
                ></div>
                
                <div className="card-body text-center p-4 position-relative">
                  {/* Icon */}
                  <div className="mb-4">
                    <div 
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{ 
                        width: "80px", 
                        height: "80px",
                        background: card.gradient,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                      }}
                    >
                      <i className={`${card.icon} fa-2x text-white`}></i>
                    </div>
                  </div>

                  {/* Title */}
                  <h5 className="card-title fw-bold text-dark mb-3" style={{ fontSize: "1.3rem" }}>
                    {card.title}
                  </h5>

                  {/* Description */}
                  <p className="card-text text-muted mb-4" style={{ lineHeight: "1.6" }}>
                    {card.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="d-flex flex-column gap-2">
                    <Link 
                      to={card.primaryLink} 
                      className="btn btn-lg fw-bold text-white shadow-sm"
                      style={{ 
                        background: card.gradient,
                        borderRadius: "15px",
                        border: "none",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                      }}
                    >
                      <i className={`${card.icon} me-2`}></i>
                      {card.primaryText}
                    </Link>
                    
                    {card.secondaryLink && (
                      <Link 
                        to={card.secondaryLink} 
                        className="btn btn-outline-secondary fw-bold"
                        style={{ 
                          borderRadius: "15px",
                          borderWidth: "2px",
                          transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = card.gradient;
                          e.target.style.borderColor = 'transparent';
                          e.target.style.color = 'white';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.borderColor = '#6c757d';
                          e.target.style.color = '#6c757d';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <i className="fas fa-plus me-2"></i>
                        {card.secondaryText}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="position-absolute top-0 end-0 p-3">
                  <div 
                    className="rounded-circle bg-white bg-opacity-20"
                    style={{ width: "40px", height: "40px" }}
                  ></div>
                </div>
                <div className="position-absolute bottom-0 start-0 p-3">
                  <div 
                    className="rounded-circle bg-white bg-opacity-10"
                    style={{ width: "60px", height: "60px" }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-lg border-0" style={{ borderRadius: "25px" }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-dark mb-3">
                    <i className="fas fa-chart-line me-3 text-primary"></i>
                    Painel de Controle
                  </h3>
                  <p className="text-muted">Acompanhe o desempenho do seu negócio em tempo real</p>
                </div>
                
                <div className="row g-4">
                  <div className="col-md-3 col-sm-6">
                    <div className="card border-0 h-100" style={{ 
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "20px"
                    }}>
                      <div className="card-body text-white text-center p-4">
                        <i className="fas fa-users fa-2x mb-3"></i>
                        <h4 className="fw-bold">127</h4>
                        <p className="mb-0">Clientes Ativos</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-3 col-sm-6">
                    <div className="card border-0 h-100" style={{ 
                      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      borderRadius: "20px"
                    }}>
                      <div className="card-body text-white text-center p-4">
                        <i className="fas fa-shopping-cart fa-2x mb-3"></i>
                        <h4 className="fw-bold">89</h4>
                        <p className="mb-0">Vendas Este Mês</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-3 col-sm-6">
                    <div className="card border-0 h-100" style={{ 
                      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      borderRadius: "20px"
                    }}>
                      <div className="card-body text-white text-center p-4">
                        <i className="fas fa-truck fa-2x mb-3"></i>
                        <h4 className="fw-bold">156</h4>
                        <p className="mb-0">Fretes Calculados</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-3 col-sm-6">
                    <div className="card border-0 h-100" style={{ 
                      background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                      borderRadius: "20px"
                    }}>
                      <div className="card-body text-white text-center p-4">
                        <i className="fas fa-heart fa-2x mb-3"></i>
                        <h4 className="fw-bold">98%</h4>
                        <p className="mb-0">Satisfação</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-lg border-0" style={{ borderRadius: "25px" }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-dark mb-3">
                    <i className="fas fa-bolt me-3 text-warning"></i>
                    Ações Rápidas
                  </h3>
                  <p className="text-muted">Acesse rapidamente as funcionalidades mais utilizadas</p>
                </div>
                
                <div className="row g-3 justify-content-center">
                  <div className="col-md-2 col-sm-4 col-6">
                    <Link to="/clientes/novo" className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3" style={{ borderRadius: "15px", minHeight: "100px" }}>
                      <i className="fas fa-user-plus fa-2x mb-2"></i>
                      <small className="fw-bold">Novo Cliente</small>
                    </Link>
                  </div>
                  
                  <div className="col-md-2 col-sm-4 col-6">
                    <Link to="/compras" className="btn btn-outline-success w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3" style={{ borderRadius: "15px", minHeight: "100px" }}>
                      <i className="fas fa-plus-circle fa-2x mb-2"></i>
                      <small className="fw-bold">Nova Venda</small>
                    </Link>
                  </div>
                  
                  <div className="col-md-2 col-sm-4 col-6">
                    <Link to="/frete" className="btn btn-outline-info w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3" style={{ borderRadius: "15px", minHeight: "100px" }}>
                      <i className="fas fa-calculator fa-2x mb-2"></i>
                      <small className="fw-bold">Calcular Frete</small>
                    </Link>
                  </div>
                  
                  <div className="col-md-2 col-sm-4 col-6">
                    <Link to="/clientes" className="btn btn-outline-secondary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3" style={{ borderRadius: "15px", minHeight: "100px" }}>
                      <i className="fas fa-search fa-2x mb-2"></i>
                      <small className="fw-bold">Buscar Cliente</small>
                    </Link>
                  </div>
                  
                  <div className="col-md-2 col-sm-4 col-6">
                    <Link to="/compras" className="btn btn-outline-warning w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3" style={{ borderRadius: "15px", minHeight: "100px" }}>
                      <i className="fas fa-chart-bar fa-2x mb-2"></i>
                      <small className="fw-bold">Relatórios</small>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm border-0" style={{ 
                background: "linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)",
                borderRadius: "25px"
              }}>
                <div className="card-body text-center py-4">
                  <div className="mb-3">
                    <i className="fas fa-heart fa-2x text-danger mb-3"></i>
                  </div>
                  <h5 className="text-dark fw-bold mb-2">
                    Pink Bella CRM - Gestão com Amor e Profissionalismo
                  </h5>
                  <p className="text-muted mb-3">
                    Simplifique sua gestão e encante seus clientes com nossa plataforma completa.
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <div className="badge bg-white text-dark px-3 py-2" style={{ borderRadius: "15px" }}>
                      <i className="fas fa-shield-alt me-2"></i>
                      Seguro
                    </div>
                    <div className="badge bg-white text-dark px-3 py-2" style={{ borderRadius: "15px" }}>
                      <i className="fas fa-rocket me-2"></i>
                      Rápido
                    </div>
                    <div className="badge bg-white text-dark px-3 py-2" style={{ borderRadius: "15px" }}>
                      <i className="fas fa-heart me-2"></i>
                      Intuitivo
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

