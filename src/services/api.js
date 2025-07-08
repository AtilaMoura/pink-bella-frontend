import axios from "axios";

// A baseURL deve ser o endereço raiz da sua API
// O endpoint específico (/clientes) será adicionado nas chamadas
const api = axios.create({
  baseURL: "http://localhost:3000", // Alterado de "/clientes"
});

export default api;