// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importe o componente Navbar (certifique-se de que o caminho está correto)
import Navbar from './components/Navbar'; 

// Importe suas páginas existentes
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import NovoCliente from './pages/Clientes/novo'; // Este componente é usado para CRIAR e EDITAR
import Compras from './pages/Compras';
import NovaCompra from './pages/Compras/novo';

// >>>>> IMPORTAÇÃO DA NOVA PÁGINA DE FRETE <<<<<
import FretePage from './pages/Frete'; // Importa a página de frete

function App() {
  return (
    <Router>
      {/* O Navbar fica aqui, fora do 'Routes', para ser exibido em TODAS as páginas */}
      <Navbar /> 

      {/* Um container para o conteúdo principal de cada página, para espaçamento */}
      <div className="container mt-4"> 
        <Routes>
          {/* Rota para a página inicial */}
          <Route path="/" element={<Home />} />

          {/* Rotas de Clientes */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/novo" element={<NovoCliente />} />
          <Route path="/clientes/editar/:id" element={<NovoCliente />} />
          
          {/* Rotas de Compras */}
          <Route path="/compras" element={<Compras />} />
          <Route path="/compras/novo/:clienteId" element={<NovaCompra />} />

          {/* >>>>> NOVA ROTA PARA A PÁGINA DE FRETE <<<<< */}
          <Route path="/frete" element={<FretePage />} />

          {/* Rota para qualquer URL não encontrada (página 404) */}
          <Route path="*" element={
            <div className="container mt-5 text-center">
              <h1>404 - Página não encontrada</h1>
              <p>A URL que você tentou acessar não existe.</p>
              <a href="/clientes" className="btn btn-primary mt-3">Voltar para a Lista de Clientes</a>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;