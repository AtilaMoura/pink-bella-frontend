// src/pages/Compras/index.jsx (Exemplo após remover o Navbar)
import React, { useEffect, useState } from "react";
import { listarCompras, atualizarStatusCompra } from "../../controllers/compraController";
import { format } from 'date-fns';

function Compras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function carregarCompras() {
      try {
        const dados = await listarCompras();
        setCompras(dados);
      } catch (err) {
        console.error("Erro ao carregar compras:", err);
        setError("Não foi possível carregar a lista de compras. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    carregarCompras();
  }, []);

  const handleMarcarComoPago = async (compra) => {
    if (compra.status_compra === "Pago") {
      setMessage(`A compra ${compra.id} já está com o status 'Pago'.`);
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const compraAtualizada = await atualizarStatusCompra(compra.id, "Pago");
      
      setCompras(prevCompras => 
        prevCompras.map(c => c.id === compra.id ? compraAtualizada : c)
      );
      setMessage(`Compra ${compra.id} marcada como 'Pago' com sucesso! O envio para o Melhor Envio está sendo processado pelo backend.`);

    } catch (err) {
      console.error("Erro ao processar compra:", err);
      setError(`Erro ao marcar compra ${compra.id} como paga: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p>Carregando compras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4 alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-4"> {/* Mantenha o container aqui para o conteúdo da página */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Compras</h2>
      </div>

      {message && <div className="alert alert-success" role="alert">{message}</div>}

      {compras.length === 0 ? (
        <p className="text-center alert alert-info">Nenhuma compra registrada ainda.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover caption-top">
            <caption>Total de Compras: {compras.length}</caption>
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Valor Total</th>
                <th>Status</th>
                <th>Frete</th>
                <th>Itens</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => (
                <tr key={compra.id}>
                  <td>{compra.id}</td>
                  <td>
                    {compra.data_compra ? format(new Date(compra.data_compra), 'dd/MM/yyyy HH:mm') : 'N/A'}
                  </td>
                  <td>{compra.cliente ? compra.cliente.nome : 'N/A'}</td>
                  <td>R$ {compra.valor_total ? compra.valor_total.toFixed(2).replace('.', ',') : '0,00'}</td>
                  <td>
                    <span className={`badge ${
                      compra.status_compra === 'Pendente' ? 'bg-warning text-dark' :
                      compra.status_compra === 'Pago' ? 'bg-success' :
                      compra.status_compra === 'Aguardando Etiqueta' ? 'bg-info text-dark' :
                      'bg-secondary'
                    }`}>
                      {compra.status_compra}
                    </span>
                  </td>
                  <td>
                    {compra.frete ? (
                      <>
                        {compra.frete.transportadora} ({compra.frete.servico})
                        <br />
                        R$ {compra.frete.valor ? compra.frete.valor.toFixed(2).replace('.', ',') : '0,00'} - {compra.frete.prazo_dias_uteis} dias úteis
                      </>
                    ) : 'N/A'}
                  </td>
                  <td>
                    {compra.itens && compra.itens.length > 0 ? (
                      <ul>
                        {compra.itens.map(item => (
                          <li key={item.id}>
                            {item.quantidade}x {item.produto ? item.produto.nome : 'Produto Desconhecido'} (R$ {item.preco_unitario_na_compra.toFixed(2).replace('.', ',')})
                          </li>
                        ))}
                      </ul>
                    ) : 'Nenhum item'}
                  </td>
                  <td className="text-center">
                    <button 
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleMarcarComoPago(compra)}
                      disabled={compra.status_compra === "Pago" || loading}
                    >
                      {compra.status_compra === "Pago" ? "Já Pago" : "Marcar como Pago"}
                    </button>
                    <button className="btn btn-outline-info btn-sm">Ver Detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Compras;