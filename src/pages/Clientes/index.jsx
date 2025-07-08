import React, { useEffect, useState } from "react";
import { listarClientes, desativarCliente } from "../../controllers/clienteController";
import { Link, useNavigate } from "react-router-dom";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("ativo"); // 'ativo', 'inativo', 'todos'
  const [termoPesquisa, setTermoPesquisa] = useState(""); // Pesquisa por nome ou CPF
  const navigate = useNavigate();

  const carregarClientes = async () => {
    try {
      const dados = await listarClientes();
      setClientes(dados);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      alert("Não foi possível carregar a lista de clientes.");
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleToggleStatus = async (clienteId, currentAtivoStatus) => {
    // currentAtivoStatus virá como 0 ou 1 do backend
    const action = currentAtivoStatus === 1 ? "desativar" : "ativar";
    if (window.confirm(`Tem certeza que deseja ${action} este cliente?`)) {
      try {
        await desativarCliente(clienteId);
        alert(`Cliente ${action} com sucesso!`);
        carregarClientes(); // Recarrega a lista para refletir a mudança
      } catch (err) {
        console.error("Erro ao alterar status do cliente:", err);
        alert(`Erro ao ${action} cliente: ${err.message || "Erro desconhecido"}`);
      }
    }
  };

  // Lógica de filtragem combinada por status e termo de pesquisa (nome/CPF)
  const clientesFiltrados = clientes.filter(cliente => {
    // O backend envia cliente.ativo como 0 ou 1.
    const ativoNoBanco = cliente.ativo; // Valor numérico (0 ou 1)

    // 1. Filtro por Status:
    const statusPass =
      (filtroStatus === "ativo" && ativoNoBanco === 1) ||      // Se o filtro é 'ativo' E o cliente tem 'ativo' = 1
      (filtroStatus === "inativo" && ativoNoBanco === 0) ||    // Ou se o filtro é 'inativo' E o cliente tem 'ativo' = 0
      filtroStatus === "todos";                                // Ou se o filtro é 'todos'

    if (!statusPass) {
      return false; // Se não passar no filtro de status, já descarta
    }

    // 2. Filtro por Nome ou CPF (se houver termo de pesquisa)
    if (termoPesquisa.trim() === "") {
      return true; // Se não houver termo, todos que passaram no filtro de status são incluídos
    }

    const termoLowerCase = termoPesquisa.toLowerCase();
    const nomeLowerCase = cliente.nome ? cliente.nome.toLowerCase() : "";
    const cpfLowerCase = cliente.cpf ? cliente.cpf.toLowerCase() : "";

    return (
      nomeLowerCase.includes(termoLowerCase) ||
      cpfLowerCase.includes(termoLowerCase)
    );
  });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Clientes</h2>
        <div className="d-flex align-items-center">
          {/* Campo de Pesquisa */}
          <input
            type="text"
            className="form-control me-3"
            placeholder="Pesquisar por nome ou CPF..."
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
            style={{ width: '250px' }}
          />

          {/* Dropdown de Filtro de Status */}
          <label htmlFor="filtroStatus" className="form-label me-2 mb-0">Mostrar:</label>
          <select
            id="filtroStatus"
            className="form-select me-3"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="ativo">Somente Ativos</option>
            <option value="inativo">Somente Inativos</option>
            <option value="todos">Todos</option>
          </select>
          <Link to="/clientes/novo" className="btn btn-primary">+ Novo Cliente</Link>
        </div>
      </div>

      {clientesFiltrados.length === 0 ? (
        <p className="text-center">Nenhum cliente encontrado com os filtros aplicados.</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>CPF</th>
              <th>Status</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => (
              // Usamos cliente.id para a key
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.email || 'N/A'}</td>
                <td>{cliente.telefone}</td>
                <td>{cliente.cpf}</td>
                {/* Exibe o status: 'Ativo' se cliente.ativo for 1, 'Inativo' se for 0 */}
                <td>{cliente.ativo === 1 ? 'Ativo' : 'Inativo'}</td>
                <td className="text-center">
                  <button
                    className="btn btn-info btn-sm me-2"
                    // Navega para editar usando cliente.id
                    onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                  >
                    Editar
                  </button>
                  {/* Botão de Desativar/Ativar com estilo e texto dinâmicos */}
                  <button
                    className={`btn btn-sm ${cliente.ativo === 1 ? 'btn-danger' : 'btn-success'} me-2`}
                    // Passa cliente.id e cliente.ativo para a função
                    onClick={() => handleToggleStatus(cliente.id, cliente.ativo)}
                  >
                    {cliente.ativo === 1 ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    // Navega para compra usando cliente.id
                    onClick={() => navigate(`/compras/novo/${cliente.id}`)}
                  >
                    Comprar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Clientes;