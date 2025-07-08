// src/pages/Home/index.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      {/* Conteúdo principal da Home */}
      <div className="container mt-5 text-center">
        <h1 className="display-4 mb-4">Bem-vindo ao Pink Bella CRM!</h1>
        <p className="lead mb-5">
          Sua plataforma completa para gerenciar clientes, produtos e vendas.
        </p>

        <div className="row justify-content-center">
          {/* Card de Clientes */}
          <div className="col-md-4 mb-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <i className="bi bi-people-fill display-4 text-primary mb-3"></i>
                <h5 className="card-title">Gerenciar Clientes</h5>
                <p className="card-text">
                  Cadastre, edite e visualize todas as informações dos seus clientes.
                </p>
                <Link to="/clientes" className="btn btn-primary btn-sm mt-2">
                  Ver Clientes
                </Link>
                <Link to="/clientes/novo" className="btn btn-outline-primary btn-sm mt-2 ms-2">
                  Novo Cliente
                </Link>
              </div>
            </div>
          </div>

          {/* Card de Compras/Vendas */}
          <div className="col-md-4 mb-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <i className="bi bi-cart-fill display-4 text-success mb-3"></i>
                <h5 className="card-title">Registrar Compras/Vendas</h5>
                <p className="card-text">
                  Registre novas transações e acompanhe o histórico de compras.
                </p>
                <Link to="/compras" className="btn btn-success btn-sm mt-2">
                  Ver Compras
                </Link>
                <Link to="/clientes" className="btn btn-outline-success btn-sm mt-2 ms-2">
                  Nova Compra
                </Link>
              </div>
            </div>
          </div>

          {/* >>>>> NOVO CARD: Calcular Frete <<<<< */}
          <div className="col-md-4 mb-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <i className="bi bi-truck-flatbed display-4 text-info mb-3"></i> {/* Ícone de caminhão */}
                <h5 className="card-title">Calcular Frete</h5>
                <p className="card-text">
                  Calcule opções de frete para qualquer CEP com base nos produtos.
                </p>
                <Link to="/frete" className="btn btn-info btn-sm mt-2">
                  Calcular Frete
                </Link>
              </div>
            </div>
          </div>
        </div> {/* Fim da Row de Cards */}

        <p className="mt-5 text-muted">
          Simplifique sua gestão.
        </p>
      </div>
    </div>
  );
}

export default Home;