// src/pages/Produtos.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function Produtos() {
  return (
    <div className="container-fluid p-0">
      <h1 style={{ color: 'white', borderBottom: '2px solid #D81B60', paddingBottom: '10px' }}>
        <i className="fas fa-box-open me-2"></i> Gerenciamento de Produtos
      </h1>
      
      <div className="row mt-4">
        <div className="col-12">
          <div 
            className="card shadow"
            style={{ backgroundColor: '#2C2C2C', border: 'none', color: 'white' }}
          >
            <div className="card-body">
              <p className="card-text">
                Esta é a página de gerenciamento de produtos. Aqui você listará, cadastrará e editará seus itens de venda.
              </p>
              
              <Link to="/produtos/novo" className="btn btn-primary" style={{ backgroundColor: '#D81B60', border: 'none' }}>
                <i className="fas fa-plus me-1"></i> Adicionar Novo Produto
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Aqui é onde a lista ou tabela de produtos será renderizada futuramente */}
      <div className="mt-5 text-center p-5" style={{ border: '1px dashed #444', borderRadius: '10px' }}>
        <p className="lead text-muted">A tabela de listagem de produtos será exibida aqui.</p>
      </div>
      
    </div>
  );
}

export default Produtos;