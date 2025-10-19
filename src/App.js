// src/App.jsx

import React, { useState } from 'react'; // Adicionado useState
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'; // Adicionado Outlet
// Assumindo que CompraContext tem a extensão .js ou .jsx
import { CompraProvider } from './pages/Compras/CompraContext.js'; 
// Importe o hook useTheme para garantir que o layout use as cores dinâmicas
import { useTheme } from './context/ThemeContext'; // Assume .js ou .jsx

// Importe os NOVOS componentes
import Sidebar from './components/Sidebar.jsx'; // Especificando .jsx
import Header from './components/Header.jsx'; // Especificando .jsx

// Importe suas páginas existentes
import Home from './pages/Home/index.jsx'; // Assumindo index.jsx na pasta Home
import Clientes from './pages/Clientes/index.jsx'; // Assumindo index.jsx na pasta Clientes
import NovoCliente from './pages/Clientes/novo.jsx'; // Especificando .jsx
import Compras from './pages/Compras/index.jsx'; // Assumindo index.jsx na pasta Compras
import NovaCompra from './pages/Compras/novo.jsx'; // Especificando .jsx
import EditarCompra from './pages/Compras/editarcompra.jsx'; // Especificando .jsx
import DetalherCompra from './pages/Compras/detalhecompra.jsx'; // Especificando .jsx
import FretePage from './pages/Frete/index.jsx'; // Assumindo index.jsx na pasta Frete
import Produtos from './pages/Produtos/Produtos.jsx'; // Especificando .jsx
import Configuracoes from './pages/Configuracoes/index.jsx'; // Especificando .jsx


// Componente de Layout que encapsula Sidebar e Header
const DashboardLayout = () => {
    // 1. Estado para controlar se a sidebar está aberta ou fechada
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    // Função para alternar o estado da sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    // Define a largura da sidebar e do header.
    const sidebarWidth = isSidebarOpen ? '280px' : '80px';
    const headerHeight = '80px'; 

    return (
        // O fundo principal da aplicação agora usa a variável CSS do tema
        <div 
            style={{
                display: 'flex', 
                minHeight: '100vh',
                backgroundColor: 'var(--background-color)', // Variável CSS do ThemeContext
                transition: 'background-color 0.3s ease',
            }}
        >
            {/* 1. BARRA LATERAL (SIDEBAR) - Passa o estado atual */}
            <Sidebar isOpen={isSidebarOpen} /> 

            {/* 2. CONTEÚDO PRINCIPAL (Área que se ajusta à direita da Sidebar) */}
            <div 
                style={{
                    flexGrow: 1, 
                    // Ajusta a margem esquerda para o tamanho atual da Sidebar
                    marginLeft: sidebarWidth, 
                    width: `calc(100% - ${sidebarWidth})`,
                    transition: 'all 0.3s ease', // Transição suave
                    position: 'relative', 
                }}
            >
                
                {/* 3. HEADER (Barra Superior) - Passa a função de toggle */}
                <Header toggleSidebar={toggleSidebar} />

                {/* 4. ÁREA DE PÁGINAS (Com padding superior para não ser coberta pelo Header fixo) */}
                <main 
                    style={{ 
                        padding: '30px', 
                        paddingTop: headerHeight, // Espaçamento para o Header fixo
                        minHeight: `calc(100vh - ${headerHeight})`,
                        color: 'var(--text-color)', // Usa a cor do texto do tema
                    }}
                > 
                    <CompraProvider> 
                        {/* 🌟 O <Outlet /> está AQUI 🌟
                        Aqui serão renderizados todos os componentes filhos da rota pai (DashboardLayout) */}
                        <Outlet /> 
                    </CompraProvider>
                </main>
            </div>
        </div>
    );
};


function App() {
    return (
        <Router>
            <Routes>
                {/* 1. Rota PAI: Renderiza o layout completo (Sidebar, Header e Conteúdo) */}
                <Route path="/" element={<DashboardLayout />}>
                    
                    {/* 2. Rotas FILHAS: Serão injetadas no <Outlet /> do componente DashboardLayout */}
                    <Route index element={<Home />} /> {/* Rota para '/' */}
                    
                    {/* Rotas de Clientes */}
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/clientes/novo" element={<NovoCliente />} />
                    <Route path="/clientes/editar/:id" element={<NovoCliente />} />
                    
                    {/* Rotas de Compras */}
                    <Route path="/compras" element={<Compras />} />
                    <Route path="/compras/novo/:clienteId" element={<NovaCompra />} />
                    <Route path="/compras/editar/:id" element={<EditarCompra />} />
                    <Route path="/compras/detalhe/:id" element={<DetalherCompra/>} />
                    
                    {/* Outras Rotas */}
                    <Route path="/frete" element={<FretePage />} />
                    <Route path="/produtos" element={<Produtos />} />
                    <Route path="/configuracoes" element={<Configuracoes />} />
                    
                    {/* Rota 404 (Renderizada dentro do Layout) */}
                    <Route path="*" element={ 
                        <div className="container mt-5 text-center">
                            <h1 style={{color: 'var(--primary-color)'}}>404 - Página não encontrada</h1>
                            <p>A URL que você tentou acessar não existe.</p>
                        </div>
                    } />
                </Route>
                {/* FIM da Rota PAI */}
            </Routes>
        </Router>
    );
}

export default App;
