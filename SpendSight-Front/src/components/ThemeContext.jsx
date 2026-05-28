import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  dark: {
    name: 'Modo Oscuro',
    bg: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    sub: 'rgba(255,255,255,0.6)',
  },
  light: {
    name: 'Modo Claro',
    bg: '#f3f4f6',
    card: '#ffffff',
    text: '#111827',
    sub: '#4b5563',
  },
  ocean: {
    name: 'Océano',
    bg: '#0f172a',
    card: '#1e293b',
    text: '#f8fafc',
    sub: '#94a3b8',
  },
  forest: {
    name: 'Esmeralda',
    bg: '#022c22',
    card: '#064e3b',
    text: '#ecfdf5',
    sub: '#6ee7b7',
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('ss_theme') || 'dark');
  const current = themes[theme] || themes.dark;

  useEffect(() => {
    localStorage.setItem('ss_theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {/* Inyección de estilos globales para que toda la app responda al tema */}
      <style>
        {`
          :root {
            --bg-main: ${current.bg};
            --bg-card: ${current.card};
            --text-main: ${current.text};
            --text-sub: ${current.sub};
          }
          body {
            background-color: ${current.bg} !important;
            color: ${current.text} !important;
            transition: background-color 0.3s ease, color 0.3s ease;
          }
          .stat-card, .card, .tx-item, .modal, .detail-panel, .form-select, .form-input {
            background-color: ${current.card} !important;
            color: ${current.text} !important;
          }
        `}
      </style>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);