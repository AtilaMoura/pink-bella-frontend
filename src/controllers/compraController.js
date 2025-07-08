// src/controllers/compraController.js
import api from '../services/api';

export async function criarCompra(compraData) {
  try {
    const response = await api.post('/compras', compraData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar compra:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function listarCompras() {
  try {
    const response = await api.get('/compras');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar compras:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function atualizarStatusCompra(compraId, novoStatus) {
  const url = `/compras/${compraId}/status`; // O caminho da URL
  const payload = { status: novoStatus }; // O corpo da requisição

  // --- ADICIONADO PARA VISUALIZAÇÃO ---
  console.log('--- ENVIANDO REQUISIÇÃO DE STATUS ---');
  console.log('Método: PATCH');
  console.log('URL Completa (para API base):', api.defaults.baseURL + url); // Concatena com a baseURL do Axios
  console.log('ID da Compra:', compraId);
  console.log('Payload (corpo da requisição):', payload);
  console.log('------------------------------------');
  // ------------------------------------

  try {
    const response = await api.put(url, payload); // Usa as variáveis url e payload
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar status da compra ${compraId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
}