// src/context/ThemeContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Cria o Contexto
const ThemeContext = createContext();

// Cores base do Pink Bella
const themes = {
    'pink-dark': {
        // Cores para o tema Escuro/Rosa principal
        '--background-color': '#1E1E1E',
        '--surface-color': '#2C2C2C', // Cor dos cards
        '--text-color': '#E0E0E0',
        '--primary-color': '#D81B60', // Rosa Escuro (Destaque)
        '--secondary-color': '#FFB6C1', // Rosa Claro (Acento)
        '--sidebar-bg': '#1E1E1E',
        '--sidebar-active-bg': 'linear-gradient(90deg, #D81B60, #1E1E1E)', // Gradiente da Sidebar
    },
    'pink-light': {
        // Cores para um tema Claro/Rosa
        '--background-color': '#F8F9FA',
        '--surface-color': '#FFFFFF', 
        '--text-color': '#212529',
        '--primary-color': '#FF69B4', // Rosa mais Claro
        '--secondary-color': '#D81B60', // Rosa Escuro
        '--sidebar-bg': '#FFFFFF',
        '--sidebar-active-bg': 'linear-gradient(90deg, #FF69B4, #FFFFFF)',
    },
    'dark-blue': {
        // Exemplo de tema Escuro/Azul
        '--background-color': '#1E1E1E',
        '--surface-color': '#2C2C2C', 
        '--text-color': '#E0E0E0',
        '--primary-color': '#3498db', // Azul Principal
        '--secondary-color': '#00f2fe',
        '--sidebar-bg': '#1E1E1E',
        '--sidebar-active-bg': 'linear-gradient(90deg, #3498db, #1E1E1E)',
    }
};

// 2. Cria o Provider
export const ThemeProvider = ({ children }) => {
    // Tenta carregar o tema do LocalStorage ou usa o 'pink-dark' como padrão
    const [currentThemeKey, setCurrentThemeKey] = useState(
        localStorage.getItem('themeKey') || 'pink-dark'
    );
    
    // Objeto do tema atual
    const currentTheme = themes[currentThemeKey];

    // 3. Aplica as variáveis CSS ao <body> sempre que o tema mudar
    useEffect(() => {
        // Salva a chave do tema no LocalStorage para persistência
        localStorage.setItem('themeKey', currentThemeKey);
        
        // Aplica as variáveis CSS ao elemento <body>
        const root = document.body;
        
        // Remove as variáveis antigas (opcional, mas garante limpeza)
        // for (const key in themes['pink-dark']) {
        //     root.style.removeProperty(key);
        // }

        // Aplica as novas variáveis
        for (const [key, value] of Object.entries(currentTheme)) {
            root.style.setProperty(key, value);
        }
    }, [currentThemeKey, currentTheme]);
    
    // Função para trocar o tema
    const changeTheme = (key) => {
        if (themes[key]) {
            setCurrentThemeKey(key);
        }
    };

    return (
        <ThemeContext.Provider value={{ currentThemeKey, currentTheme, changeTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};

// 4. Cria o Hook Customizado para consumo
export const useTheme = () => {
    return useContext(ThemeContext);
};