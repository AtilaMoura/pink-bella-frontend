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
    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar status da compra ${compraId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function atualizarRastreio () {
  try {
    const url = '/melhor-envio/rastreios/atualizar'
    const response = await api.get(url);
    const data = await response.data;
    if (data.sucesso) {
      console.log('Rastreio atualizado com sucesso!');
    } else {
      console.error('Erro ao atualizar rastreio:', data);
    }
  } catch (error) {
    console.error('Erro ao atualizar rastreio:', error);
  }
};

// Buscar compra pelo ID
export async function buscarCompraPorId(id) {
  try {
    const response = await api.get(`/compras/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar compra por ID:", error);
    throw error;
  }
}

// Listar clientes
export async function listarClientes() {
  try {
    const response = await api.get('/clientes');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    throw error;
  }
}

// Listar produtos
export async function listarProdutos() {
  try {
    const response = await api.get('/produtos');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    throw error;
  }
}

// Calcular frete
export async function calcularFrete(payload) {
  try {
    const response = await api.post('/frete/calcular', payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    throw error;
  }
}

// Atualizar compra
export async function atualizarCompra(id, payload) {
  try {
    const response = await api.put(`/compras/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar compra:', error);
    throw error;
  }
}