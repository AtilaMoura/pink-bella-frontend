import api from '../services/api';

export async function listarProdutos() {
  try {
    // A rota da sua API para produtos é '/produtos' (concatenada com a baseURL do api.js)
    const response = await api.get('/produtos');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    throw error;
  }
}