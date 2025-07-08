import api from '../services/api'; // Corrija para incluir .js se necessário: '../services/api.js'

const calcularFrete = async (cepDestino, itens) => {
  try {
    const response = await api.post('/frete/calcular', {
      cepDestino,
      itens,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao calcular frete:', error.response?.data || error.message);
    throw error;
  }
};

// 2. Mude a exportação para a sintaxe de ES Modules
export { calcularFrete }; // <<< ESTA É A MUDANÇA CRÍTICA!