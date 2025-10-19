// src/pages/Configuracoes/index.jsx

import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // Importa o hook

// Cores para estilização local
const DARK_CARD_BG = 'var(--surface-color)';
const TEXT_COLOR = 'var(--text-color)';
const ACCENT_COLOR = 'var(--primary-color)';
const LIGHT_ACCENT = 'var(--secondary-color)';

function Configuracoes() {
    // Usa o hook para acessar o tema e a função de troca
    const { currentThemeKey, changeTheme, themes } = useTheme();

    // Dados de exemplo para exibição no card
    const themeOptions = [
        { 
            key: 'pink-dark', 
            name: 'Pink Dark (Padrão)', 
            primary: themes['pink-dark']['--primary-color'] 
        },
        { 
            key: 'pink-light', 
            name: 'Pink Light', 
            primary: themes['pink-light']['--primary-color'] 
        },
        { 
            key: 'dark-blue', 
            name: 'Dark Blue', 
            primary: themes['dark-blue']['--primary-color'] 
        },
    ];

    return (
        <div className="container-fluid p-0">
            <h1 className="fw-bold" style={{ color: TEXT_COLOR, borderBottom: `2px solid ${ACCENT_COLOR}`, paddingBottom: '10px' }}>
                <i className="fas fa-cog me-2" style={{ color: ACCENT_COLOR }}></i> Configurações do Sistema
            </h1>
            
            <div className="row mt-4">
                
                {/* Card de Configuração de Tema/Cor */}
                <div className="col-md-8 mb-4">
                    <div 
                        className="card shadow-lg border-0"
                        style={{ backgroundColor: DARK_CARD_BG, color: TEXT_COLOR, borderRadius: '15px' }}
                    >
                        <div className="card-body p-4">
                            <h5 className="card-title fw-bold mb-4" style={{ color: LIGHT_ACCENT }}>
                                <i className="fas fa-paint-brush me-2"></i> Configuração de Cores (Tema)
                            </h5>
                            
                            <p className="card-text text-muted mb-4">
                                Selecione um dos temas pré-definidos para personalizar a aparência do seu Dashboard. O tema será aplicado imediatamente em todos os componentes.
                            </p>

                            <div className="row g-3">
                                {themeOptions.map((theme) => (
                                    <div className="col-lg-4 col-md-6" key={theme.key}>
                                        <button 
                                            className={`btn w-100 p-3 d-flex flex-column align-items-center ${currentThemeKey === theme.key ? 'shadow-lg' : 'btn-outline-secondary'}`}
                                            onClick={() => changeTheme(theme.key)}
                                            style={{ 
                                                // Estilização do botão para o tema ativo
                                                backgroundColor: currentThemeKey === theme.key ? theme.primary : 'transparent',
                                                borderColor: theme.primary,
                                                color: currentThemeKey === theme.key ? 'white' : LIGHT_ACCENT,
                                                fontWeight: 'bold',
                                                borderRadius: '10px',
                                                borderWidth: '2px',
                                            }}
                                        >
                                            <div 
                                                style={{ 
                                                    width: '20px', 
                                                    height: '20px', 
                                                    backgroundColor: theme.primary, 
                                                    borderRadius: '50%',
                                                    marginBottom: '8px',
                                                    border: `2px solid ${currentThemeKey === theme.key ? 'white' : theme.primary}`
                                                }}
                                            ></div>
                                            {theme.name}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Card de Configuração de Loja (Baseado na sua DB) */}
                <div className="col-md-4 mb-4">
                    <div 
                        className="card shadow-lg border-0 h-100"
                        style={{ backgroundColor: DARK_CARD_BG, color: TEXT_COLOR, borderRadius: '15px' }}
                    >
                        <div className="card-body p-4">
                            <h5 className="card-title fw-bold mb-4" style={{ color: LIGHT_ACCENT }}>
                                <i className="fas fa-store me-2"></i> Dados da Loja
                            </h5>
                            <p className="card-text text-muted mb-4">
                                Gerencie as informações de endereço e contato da sua loja (**`configuracoes_loja`** na sua DB) para cálculo de frete e documentos.
                            </p>
                            <button 
                                className="btn w-100 fw-bold" 
                                style={{ backgroundColor: ACCENT_COLOR, color: 'white' }}
                            >
                                Editar Dados da Loja
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default Configuracoes;