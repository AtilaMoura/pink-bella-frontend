import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
// Simulação do ThemeContext para evitar erro de importação externa no ambiente isolado.
// Em um projeto real, esta importação seria: import { useTheme } from '../../context/ThemeContext.js';
const useTheme = () => ({
    currentTheme: {
        primaryColor: '#ff69b4', // Exemplo de cor primária (Rosa)
        secondaryColor: '#3498db', // Exemplo de cor secundária (Azul)
        textColor: '#333333',
        surfaceColor: '#ffffff',
        backgroundColorSubtle: '#f8f9fa'
    }
}); 

// --- SIMULAÇÃO DO CompraContext ATUALIZADA ---
// A lista de compras T (comprasT) que seria fornecida pelo seu Contexto real,
// usando a nova estrutura de dados real que você forneceu.
const mockComprasT = [
    {
        id: 78,
        cliente: { id: 2, nome: 'Irsa de Souza dos Santos' },
        data_compra: '2025-10-18 19:38:08', // Simulando "Hoje"
        status_compra: 'Postado', // Exemplo de status real
        valor_total: 396.55,
    },
    {
        id: 77,
        cliente: { id: 26, nome: 'Doralice Camilo Vinoti' },
        data_compra: '2025-10-17 19:37:24', // Simulando "Ontem"
        status_compra: 'Em Envio',
        valor_total: 337.01,
    },
    {
        id: 76,
        cliente: { id: 3, nome: 'Mariana Silva' },
        data_compra: '2025-10-16 10:00:00',
        status_compra: 'Pendente',
        valor_total: 450.00,
    },
    {
        id: 75,
        cliente: { id: 4, nome: 'João Pedro' },
        data_compra: '2025-10-15 15:30:00',
        status_compra: 'Entregue',
        valor_total: 120.50,
    },
    {
        id: 74,
        cliente: { id: 5, nome: 'Carla Moreira' },
        data_compra: '2025-10-14 09:00:00',
        status_compra: 'Cancelado',
        valor_total: 98.90,
    },
];

// Mocking the Context object itself
const CompraContext = React.createContext(); 
const useMockCompraContext = () => ({
    comprasT: mockComprasT,
    setComprasT: () => {}, 
    carregarComprasT: () => {} 
});
// --- FIM DA SIMULAÇÃO ---

function Home() {
    // Usando o hook simulado de Tema
    const { currentTheme } = useTheme(); 
    
    // INTEGRAÇÃO: Usando o hook simulado de CompraContext para acessar comprasT
    // No seu projeto real, você usaria: const { comprasT } = useContext(CompraContext);
    const { comprasT } = useMockCompraContext(); 

    const [currentTime, setCurrentTime] = useState(new Date());
    const [animateCards, setAnimateCards] = useState(false);
    const [filterPeriod, setFilterPeriod] = useState('month'); // 'day', 'week', 'month', 'year'

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
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };
    
    // Função para formatar o valor como moeda (BRL)
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(value);
    };

    // Dados de exemplo para os Cards de Analytics
    const analyticsData = [
        {
            icon: 'fas fa-money-bill-wave',
            title: 'Faturamento Total',
            value: 'R$ 15.450,80',
            period: 'Este Mês',
            // Cores dinâmicas para o gradiente
            primaryColor: '#2ecc71', // Verde
            secondaryColor: '#27ae60', 
            delay: '0.1s'
        },
        {
            icon: 'fas fa-shopping-bag',
            title: 'Total de Vendas',
            value: '189',
            period: 'Este Mês',
            // Usando a cor primária dinâmica do tema para o segundo card
            primaryColor: currentTheme.primaryColor, // Usando cor simulada
            secondaryColor: currentTheme.secondaryColor, // Usando cor simulada
            delay: '0.2s'
        },
        {
            icon: 'fas fa-users',
            title: 'Novos Clientes',
            value: '23',
            period: 'Este Mês',
            primaryColor: '#3498db', // Azul
            secondaryColor: '#2980b9', 
            delay: '0.3s'
        },
        {
            icon: 'fas fa-box-open',
            title: 'Produtos em Estoque',
            value: '956',
            period: 'Geral',
            primaryColor: '#f1c40f', // Amarelo
            secondaryColor: '#f39c12', 
            delay: '0.4s'
        },
    ];

    // DEFINIÇÃO DE DADOS: Agora utiliza comprasT do contexto, limitando aos 5 mais recentes.
    const latestPurchases = comprasT.slice(0, 5);

    // Função para determinar a cor do badge de status
    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case 'Pendente':
                return { backgroundColor: '#ff9800', color: 'white' }; // Laranja
            case 'Entregue':
                return { backgroundColor: '#2ecc71', color: 'white' }; // Verde
            case 'Em Envio':
            case 'Postado': // Incluindo "Postado" nos dados reais
                return { backgroundColor: '#3498db', color: 'white' }; // Azul
            case 'Cancelado':
                return { backgroundColor: '#e74c3c', color: 'white' }; // Vermelho
            default:
                return { backgroundColor: 'gray', color: 'white' };
        }
    };

    // Função para formatar a data da compra (handle "YYYY-MM-DD HH:MM:SS" e mostrar "Hoje"/"Ontem")
    const formatPurchaseDate = (dateTimeString) => {
        // Pega apenas a parte da data "YYYY-MM-DD"
        const datePart = dateTimeString.split(' ')[0]; 
        const today = new Date().toISOString().split('T')[0];
        
        // Calcula o dia de ontem
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = yesterdayDate.toISOString().split('T')[0];

        if (datePart === today) return 'Hoje';
        if (datePart === yesterday) return 'Ontem';

        // Formata para DD/MM/AAAA
        return new Date(datePart + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Estilos comuns reutilizáveis
    const cardBaseStyle = {
        borderRadius: "15px",
        background: 'var(--surface-color)', // Fundo do Card
        color: 'var(--text-color)', // Cor do Texto
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        transition: 'all 0.4s ease',
        cursor: 'pointer'
    };

    return (
        <div className="container-fluid py-4"> 
            
            {/* Título e Filtro */}
            <div className="row mb-4 align-items-center">
                <div className="col-md-6">
                    <h1 className="fw-bold" style={{ color: 'var(--text-color)' }}>
                        <i className="fas fa-tachometer-alt me-3" style={{ color: 'var(--primary-color)' }}></i>
                        Dashboard Principal
                    </h1>
                </div>
                
                {/* Filtro de Período */}
                <div className="col-md-6 text-md-end">
                    <div className="btn-group" role="group" aria-label="Filtro de Período">
                        {['day', 'week', 'month', 'year'].map((period) => (
                            <button
                                key={period}
                                type="button"
                                className={`btn fw-bold ${filterPeriod === period ? 'text-white' : 'btn-outline-secondary'}`}
                                style={{
                                    // Usa a cor primária para o botão ativo
                                    backgroundColor: filterPeriod === period ? 'var(--primary-color)' : 'transparent',
                                    borderColor: 'var(--primary-color)', // Borda Primária
                                    color: filterPeriod === period ? 'white' : 'var(--primary-color)',
                                    transition: 'all 0.3s',
                                    borderRadius: '8px',
                                    margin: '0 2px'
                                }}
                                onClick={() => setFilterPeriod(period)}
                            >
                                {period === 'day' && 'Dia'}
                                {period === 'week' && 'Semana'}
                                {period === 'month' && 'Mês'}
                                {period === 'year' && 'Ano'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Linha de Indicadores/Cards de Estatísticas */}
            <div className="row g-4 mb-5">
                {analyticsData.map((card, index) => (
                    <div key={index} className="col-lg-3 col-md-6">
                        <div 
                            className={`card h-100 border-0 shadow-lg ${animateCards ? 'animate__animated animate__fadeIn' : ''}`}
                            style={{ 
                                ...cardBaseStyle,
                                // Define a cor da borda esquerda usando a cor primária do card (ou a cor do tema, se for variável)
                                borderLeft: `5px solid ${card.primaryColor.includes('var(') ? currentTheme.primaryColor : card.primaryColor}`, 
                                transform: animateCards ? 'translateY(0)' : 'translateY(20px)',
                                opacity: animateCards ? 1 : 0,
                                transition: `all 0.4s ease ${card.delay}`,
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.5)'}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)'}
                        >
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <p className="text-uppercase fw-semibold mb-1" style={{ fontSize: '0.9rem', color: card.primaryColor.includes('var(') ? currentTheme.primaryColor : card.primaryColor }}>
                                            {card.title}
                                        </p>
                                        <h3 className="fw-bold mb-0" style={{ color: 'var(--text-color)' }}>
                                            {card.value}
                                        </h3>
                                    </div>
                                    <i 
                                        className={`${card.icon} fa-3x`} 
                                        style={{ color: card.secondaryColor.includes('var(') ? currentTheme.secondaryColor : card.secondaryColor, opacity: 0.8 }}
                                    ></i>
                                </div>
                                <small className="text-muted mt-2 d-block">
                                    Análise: {filterPeriod === 'day' ? 'Hoje' : card.period}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Relatório de Ações e Hora Atual */}
            <div className="row g-4 mb-5">
                
                {/* 1. Tabela de Últimas Compras (Dinâmico) */}
                <div className="col-lg-8">
                    <div 
                        className="card h-100 border-0 shadow-lg"
                        style={cardBaseStyle}
                    >
                        <div 
                            className="card-header border-0" 
                            style={{ 
                                // Cor Primária no cabeçalho
                                background: 'var(--primary-color)', 
                                color: 'white', 
                                borderTopLeftRadius: '15px', 
                                borderTopRightRadius: '15px' 
                            }}>
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-list-alt me-2"></i> Últimas Compras
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            {/* A tabela agora é populada dinamicamente usando latestPurchases (que é um slice de comprasT) */}
                            <table className="table table-striped table-hover" style={{ '--bs-table-bg': 'var(--surface-color)', '--bs-table-color': 'var(--text-color)', border: `1px solid var(--border-color)` }}>
                                <thead>
                                    <tr>
                                        <th style={{ color: 'var(--primary-color)' }}>Cliente</th>
                                        <th style={{ color: 'var(--primary-color)' }}>Data</th>
                                        <th className="text-end" style={{ color: 'var(--primary-color)' }}>Valor Total</th>
                                        <th style={{ color: 'var(--primary-color)' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {latestPurchases.map((purchase) => (
                                        <tr key={purchase.id}>
                                            {/* Usando purchase.cliente.nome */}
                                            <td className="fw-semibold">{purchase.cliente.nome}</td>
                                            {/* Usando purchase.data_compra */}
                                            <td className="text-muted"><i className="far fa-calendar-alt me-1"></i> {formatPurchaseDate(purchase.data_compra)}</td>
                                            {/* Usando purchase.valor_total com formatação de moeda */}
                                            <td className="fw-bold text-end">{formatCurrency(purchase.valor_total)}</td>
                                            {/* Usando purchase.status_compra */}
                                            <td>
                                                <span 
                                                    className="badge rounded-pill fw-bold py-2 px-3" 
                                                    style={getStatusBadgeStyle(purchase.status_compra)}
                                                >
                                                    {purchase.status_compra}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Link 
                                to="/compras" 
                                className="btn btn-sm mt-3 fw-bold" 
                                style={{ 
                                    // Cor Secundária para o botão
                                    backgroundColor: 'var(--secondary-color)', 
                                    color: 'var(--surface-color)',
                                    borderRadius: '10px'
                                }}>
                                Ver todas as Vendas <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 2. Relógio e Ações Rápidas */}
                <div className="col-lg-4">
                    <div 
                        className="card h-100 border-0 shadow-lg"
                        style={cardBaseStyle}
                    >
                        <div className="card-body text-center p-4">
                            
                            {/* Relógio e Data */}
                            <div className="p-3 mb-4" style={{ backgroundColor: 'var(--background-color-subtle)', borderRadius: '10px' }}>
                                <i className="fas fa-clock fa-3x mb-3" style={{ color: 'var(--primary-color)' }}></i>
                                <h2 className="display-4 fw-bold" style={{ color: 'var(--text-color)' }}>{formatTime(currentTime)}</h2>
                                <p className="lead" style={{ color: 'var(--secondary-color)' }}>{formatDate(currentTime)}</p>
                            </div>
                            
                            {/* Ações Rápidas - Simplificado */}
                            <h5 className="fw-bold mb-3" style={{ color: 'var(--text-color)' }}>
                                Ações Rápidas
                            </h5>
                            <div className="d-grid gap-2">
                                {/* Botão Principal (Nova Venda) usando Cor Primária */}
                                <Link to="/compras" className="btn btn-lg fw-bold" style={{ backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '10px' }}>
                                    <i className="fas fa-plus-circle me-2"></i> Nova Venda
                                </Link>
                                
                                {/* Botão Secundário (Novo Cliente) usando Cor Secundária */}
                                <Link to="/clientes/novo" className="btn btn-lg fw-bold" style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--surface-color)', borderRadius: '10px' }}>
                                    <i className="fas fa-user-plus me-2"></i> Novo Cliente
                                </Link>
                                
                                {/* Botão de Contorno */}
                                <Link 
                                    to="/frete" 
                                    className="btn btn-lg fw-bold btn-outline-light" 
                                    style={{ 
                                        borderColor: 'var(--primary-color)', 
                                        color: 'var(--primary-color)',
                                        borderRadius: '10px'
                                    }}>
                                    <i className="fas fa-truck me-2"></i> Calcular Frete
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Espaço para Gráfico */}
            <div className="row g-4 mb-5">
                <div className="col-12">
                     <div 
                        className="card h-100 border-0 shadow-lg p-5 text-center"
                        style={{ ...cardBaseStyle, border: '1px dashed var(--secondary-color)' }}
                    >
                        <h5 style={{ color: 'var(--text-color)' }}>Espaço para Gráfico de Vendas e Faturamento por Período.</h5>
                        <p className="text-muted" style={{ color: 'var(--secondary-color)' }}>Use o filtro acima (Dia/Semana/Mês/Ano) para carregar os dados aqui.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
