import React, { useEffect, useState } from "react";
import { listarClientes, desativarCliente } from "../../controllers/clienteController";
import { Link, useNavigate } from "react-router-dom";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("ativo"); // 'ativo', 'inativo', 'todos'
  const [termoPesquisa, setTermoPesquisa] = useState(""); // Pesquisa por nome ou CPF
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const dados = await listarClientes();
      setClientes(dados);
      setError(null);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      setError("Não foi possível carregar a lista de clientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleToggleStatus = async (clienteId, currentAtivoStatus) => {
    const action = currentAtivoStatus === 1 ? "desativar" : "ativar";
    if (window.confirm(`Tem certeza que deseja ${action} este cliente?`)) {
      try {
        await desativarCliente(clienteId);
        setMessage(`Cliente ${action} com sucesso!`);
        setError(null);
        carregarClientes();
        
        // Remove a mensagem após 3 segundos
        setTimeout(() => setMessage(null), 3000);
      } catch (err) {
        console.error("Erro ao alterar status do cliente:", err);
        setError(`Erro ao ${action} cliente: ${err.message || "Erro desconhecido"}`);
        setMessage(null);
      }
    }
  };

  // Lógica de filtragem combinada por status e termo de pesquisa (nome/CPF)
  const clientesFiltrados = clientes.filter(cliente => {
    const ativoNoBanco = cliente.ativo;

    // 1. Filtro por Status:
    const statusPass =
      (filtroStatus === "ativo" && ativoNoBanco === 1) ||
      (filtroStatus === "inativo" && ativoNoBanco === 0) ||
      filtroStatus === "todos";

    if (!statusPass) {
      return false;
    }

    // 2. Filtro por Nome ou CPF (se houver termo de pesquisa)
    if (termoPesquisa.trim() === "") {
      return true;
    }

    const termoLowerCase = termoPesquisa.toLowerCase();
    const nomeLowerCase = cliente.nome ? cliente.nome.toLowerCase() : "";
    const cpfLowerCase = cliente.cpf ? cliente.cpf.toLowerCase() : "";

    return (
      nomeLowerCase.includes(termoLowerCase) ||
      cpfLowerCase.includes(termoLowerCase)
    );
  });

  // Estatísticas dos clientes
  const estatisticas = {
    total: clientes.length,
    ativos: clientes.filter(c => c.ativo === 1).length,
    inativos: clientes.filter(c => c.ativo === 0).length,
    filtrados: clientesFiltrados.length
  };

  if (loading) {
    return (
      <div style={{ 
        background: "linear-gradient(135deg, #FFE5E5 0%, #FFC5C5 50%, #FFB3BA 100%)",
        minHeight: "100vh"
      }} className="d-flex justify-content-center align-items-center">
        <div className="card shadow-lg border-0" style={{ borderRadius: "20px" }}>
          <div className="card-body text-center p-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <h5 className="text-primary">Carregando clientes...</h5>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #FFE5E5 0%, #FFC5C5 50%, #FFB3BA 100%)",
      minHeight: "100vh"
    }} className="p-4">
      
      {/* Header Pinkbella */}
      <div className="container-fluid mb-4">
        <div className="card shadow-lg border-0" style={{ 
          background: "linear-gradient(135deg, #FF69B4 0%, #FFB6C1 50%, #FFC0CB 100%)",
          borderRadius: "20px"
        }}>
          <div className="card-body text-white text-center py-4">
            <h1 className="display-4 fw-bold mb-2" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
              👥 Pink Bella - Gestão de Clientes
            </h1>
            <p className="lead mb-0">Painel de clientes elegante e profissional</p>
          </div>
        </div>
      </div>

      {/* Dashboard de Estatísticas */}
      <div className="container-fluid mb-4">
        <div className="row g-3">
          <div className="col-md-3 col-sm-6">
            <div className="card shadow-sm border-0 h-100" style={{ 
              background: "linear-gradient(135deg, #E6F3FF 0%, #CCE7FF 100%)",
              borderRadius: "15px"
            }}>
              <div className="card-body text-center">
                <i className="fas fa-users fa-2x text-primary mb-2"></i>
                <h6 className="text-dark fw-bold">Total de Clientes</h6>
                <h3 className="fw-bold text-primary">{estatisticas.total}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="card shadow-sm border-0 h-100" style={{ 
              background: "linear-gradient(135deg, #E8F5E8 0%, #D4F4D4 100%)",
              borderRadius: "15px"
            }}>
              <div className="card-body text-center">
                <i className="fas fa-user-check fa-2x text-success mb-2"></i>
                <h6 className="text-dark fw-bold">Clientes Ativos</h6>
                <h3 className="fw-bold text-success">{estatisticas.ativos}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="card shadow-sm border-0 h-100" style={{ 
              background: "linear-gradient(135deg, #FFF0F0 0%, #FFE0E0 100%)",
              borderRadius: "15px"
            }}>
              <div className="card-body text-center">
                <i className="fas fa-user-times fa-2x text-danger mb-2"></i>
                <h6 className="text-dark fw-bold">Clientes Inativos</h6>
                <h3 className="fw-bold text-danger">{estatisticas.inativos}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="card shadow-sm border-0 h-100" style={{ 
              background: "linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)",
              borderRadius: "15px"
            }}>
              <div className="card-body text-center">
                <i className="fas fa-filter fa-2x text-warning mb-2"></i>
                <h6 className="text-dark fw-bold">Resultados Filtrados</h6>
                <h3 className="fw-bold text-warning">{estatisticas.filtrados}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Filtros e Ações */}
      <div className="container-fluid mb-4">
        <div className="card shadow-sm border-0" style={{ borderRadius: "15px" }}>
          <div className="card-header bg-light" style={{ borderRadius: "15px 15px 0 0" }}>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-dark fw-bold">
                <i className="fas fa-search me-2 text-primary"></i>
                Filtros e Ações
              </h5>
              <Link 
                to="/clientes/novo" 
                className="btn fw-bold text-white shadow-sm"
                style={{ 
                  background: "linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)",
                  borderRadius: "20px",
                  border: "none"
                }}
              >
                <i className="fas fa-plus me-2"></i>
                Novo Cliente
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark">
                  <i className="fas fa-search me-2 text-primary"></i>
                  Pesquisar Cliente
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-primary text-white">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Digite o nome ou CPF do cliente..."
                    value={termoPesquisa}
                    onChange={(e) => setTermoPesquisa(e.target.value)}
                    style={{ borderRadius: "0 10px 10px 0" }}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold text-dark">
                  <i className="fas fa-filter me-2 text-secondary"></i>
                  Filtrar por Status
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-secondary text-white">
                    <i className="fas fa-list"></i>
                  </span>
                  <select
                    className="form-select"
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    style={{ borderRadius: "0 10px 10px 0" }}
                  >
                    <option value="ativo">Somente Ativos</option>
                    <option value="inativo">Somente Inativos</option>
                    <option value="todos">Todos os Clientes</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <button
                  className="btn btn-outline-secondary w-100 fw-bold"
                  style={{ borderRadius: "10px" }}
                  onClick={() => {
                    setTermoPesquisa("");
                    setFiltroStatus("ativo");
                  }}
                >
                  <i className="fas fa-eraser me-2"></i>
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagens de Feedback */}
      {message && (
        <div className="container-fluid mb-4">
          <div className="alert alert-success shadow-sm d-flex align-items-center" style={{ borderRadius: "15px" }}>
            <i className="fas fa-check-circle me-3 fa-lg"></i>
            <div>
              <strong>Sucesso!</strong> {message}
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="container-fluid mb-4">
          <div className="alert alert-danger shadow-sm d-flex align-items-center" style={{ borderRadius: "15px" }}>
            <i className="fas fa-exclamation-triangle me-3 fa-lg"></i>
            <div>
              <strong>Erro!</strong> {error}
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Clientes */}
      <div className="container-fluid">
        <div className="card shadow-lg border-0" style={{ borderRadius: "20px" }}>
          <div className="card-header text-white" style={{ 
            background: "linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)",
            borderRadius: "20px 20px 0 0"
          }}>
            <h5 className="mb-0 fw-bold">
              <i className="fas fa-list me-2"></i>
              Lista de Clientes ({clientesFiltrados.length})
            </h5>
          </div>
          <div className="card-body p-0">
            {clientesFiltrados.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-users fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">Nenhum cliente encontrado</h5>
                <p className="text-muted">
                  {termoPesquisa || filtroStatus !== "todos" 
                    ? "Tente ajustar os filtros de pesquisa." 
                    : "Comece adicionando seu primeiro cliente."}
                </p>
                {!termoPesquisa && filtroStatus === "todos" && (
                  <Link 
                    to="/clientes/novo" 
                    className="btn fw-bold text-white mt-3"
                    style={{ 
                      background: "linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)",
                      borderRadius: "20px",
                      border: "none"
                    }}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Adicionar Primeiro Cliente
                  </Link>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-bold">
                        <i className="fas fa-hashtag me-1 text-primary"></i>
                        ID
                      </th>
                      <th className="fw-bold">
                        <i className="fas fa-user me-1 text-primary"></i>
                        Nome
                      </th>
                      <th className="fw-bold">
                        <i className="fas fa-envelope me-1 text-primary"></i>
                        Email
                      </th>
                      <th className="fw-bold">
                        <i className="fas fa-phone me-1 text-primary"></i>
                        Telefone
                      </th>
                      <th className="fw-bold">
                        <i className="fas fa-id-card me-1 text-primary"></i>
                        CPF
                      </th>
                      <th className="fw-bold">
                        <i className="fas fa-info-circle me-1 text-primary"></i>
                        Status
                      </th>
                      <th className="fw-bold text-center">
                        <i className="fas fa-cogs me-1 text-primary"></i>
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados.map((cliente) => (
                      <tr key={cliente.id} className="align-middle">
                        <td className="fw-bold text-primary">#{cliente.id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                                 style={{ width: "40px", height: "40px" }}>
                              <i className="fas fa-user"></i>
                            </div>
                            <div>
                              <div className="fw-bold text-dark">{cliente.nome}</div>
                              <small className="text-muted">Cliente #{cliente.id}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="fas fa-envelope text-muted me-2"></i>
                            <span>{cliente.email || 'N/A'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="fas fa-phone text-muted me-2"></i>
                            <span>{cliente.telefone}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="fas fa-id-card text-muted me-2"></i>
                            <span className="font-monospace">{cliente.cpf}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge px-3 py-2 ${cliente.ativo === 1 ? 'bg-success' : 'bg-danger'}`} 
                                style={{ borderRadius: "20px", fontSize: "0.85rem" }}>
                            <i className={`fas ${cliente.ativo === 1 ? 'fa-check-circle' : 'fa-times-circle'} me-1`}></i>
                            {cliente.ativo === 1 ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-outline-info btn-sm fw-bold"
                              onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                              title="Editar cliente"
                              style={{ borderRadius: "20px 0 0 20px" }}
                            >
                              <i className="fas fa-edit me-1"></i>
                              Editar
                            </button>
                            <button
                              className={`btn btn-sm fw-bold ${cliente.ativo === 1 ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              onClick={() => handleToggleStatus(cliente.id, cliente.ativo)}
                              title={cliente.ativo === 1 ? 'Desativar cliente' : 'Ativar cliente'}
                              style={{ borderRadius: "0" }}
                            >
                              <i className={`fas ${cliente.ativo === 1 ? 'fa-user-times' : 'fa-user-check'} me-1`}></i>
                              {cliente.ativo === 1 ? 'Desativar' : 'Ativar'}
                            </button>
                            <button
                              className="btn btn-outline-primary btn-sm fw-bold"
                              onClick={() => navigate(`/compras/novo/${cliente.id}`)}
                              title="Nova compra para este cliente"
                              style={{ borderRadius: "0 20px 20px 0" }}
                            >
                              <i className="fas fa-shopping-cart me-1"></i>
                              Comprar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Pinkbella */}
      <footer className="mt-5 py-4 text-center">
        <div className="card shadow-sm border-0" style={{ 
          background: "linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)",
          borderRadius: "20px"
        }}>
          <div className="card-body">
            <p className="text-dark mb-0 fw-bold">
              <i className="fas fa-heart me-2 text-danger"></i>
              Pink Bella - Gestão de Clientes com Amor e Profissionalismo
              <i className="fas fa-heart ms-2 text-danger"></i>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Clientes;

