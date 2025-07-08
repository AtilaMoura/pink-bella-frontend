// src/pages/Compras/novo.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { criarCompra } from "../../controllers/compraController";
import { buscarClientePorId } from "../../controllers/clienteController";
import { listarProdutos } from "../../controllers/produtoController"; // Importe a nova função

function NovaCompra() {
  const navigate = useNavigate();
  const { clienteId } = useParams();

  const [clienteNome, setClienteNome] = useState("");
  const [produtos, setProdutos] = useState([]); // Novo estado para armazenar os produtos
  const [itens, setItens] = useState([{ produto_id: "", quantidade: 1 }]);
  const [loading, setLoading] = useState(false);

  // Efeito para carregar o nome do cliente e a lista de produtos
  useEffect(() => {
    async function fetchData() {
      // Carrega nome do cliente
      if (clienteId) {
        try {
          const clienteData = await buscarClientePorId(clienteId);
          setClienteNome(clienteData.nome);
        } catch (error) {
          console.error("Erro ao buscar nome do cliente:", error);
          setClienteNome("Cliente Desconhecido");
        }
      }

      // Carrega lista de produtos
      try {
        const produtosData = await listarProdutos();
        setProdutos(produtosData);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert("Não foi possível carregar a lista de produtos.");
      }
    }
    fetchData();
  }, [clienteId]); // Depende do clienteId para recarregar se mudar

  const handleItemChange = (index, event) => {
    const { name, value } = event.target;
    const newItens = [...itens];
    // Converte quantidade para número e produto_id para número
    newItens[index] = {
      ...newItens[index],
      [name]: name === "quantidade" || name === "produto_id" ? parseInt(value) : value,
    };
    setItens(newItens);
  };

  const handleAddItem = () => {
    setItens([...itens, { produto_id: "", quantidade: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const newItens = itens.filter((_, i) => i !== index);
    setItens(newItens);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const itensValidos = itens.every(item => item.produto_id && item.quantidade > 0);
    if (!itensValidos) {
      alert("Por favor, selecione um produto e informe uma quantidade válida para todos os itens da compra.");
      setLoading(false);
      return;
    }

    try {
      const compraData = {
        cliente_id: parseInt(clienteId),
        itens: itens, // 'itens' já deve ter produto_id e quantidade como números
      };
      await criarCompra(compraData);
      alert("Compra registrada com sucesso!");
      navigate("/clientes");
    } catch (error) {
      console.error("Erro ao registrar compra:", error);
      alert("Erro ao registrar compra. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Registrar Nova Compra para {clienteNome}</h2>
      <form onSubmit={handleSubmit}>
        {itens.map((item, index) => (
          <div key={index} className="row mb-3 align-items-end border p-3 rounded">
            <div className="col-md-5">
              <label htmlFor={`produto_id_${index}`} className="form-label">Produto</label>
              <select
                className="form-select"
                id={`produto_id_${index}`}
                name="produto_id"
                value={item.produto_id}
                onChange={(e) => handleItemChange(index, e)}
                required
              >
                <option value="">Selecione um produto</option>
                {produtos.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} (R$ {produto.preco.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-5">
              <label htmlFor={`quantidade_${index}`} className="form-label">Quantidade</label>
              <input
                type="number"
                className="form-control"
                id={`quantidade_${index}`}
                name="quantidade"
                value={item.quantidade}
                onChange={(e) => handleItemChange(index, e)}
                required
                min="1"
              />
            </div>
            <div className="col-md-2 text-end">
              {itens.length > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleRemoveItem(index)}
                >
                  Remover Item
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="mb-3">
          <button type="button" className="btn btn-secondary me-2" onClick={handleAddItem}>
            Adicionar Mais Itens
          </button>
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Compra"}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/clientes")}
          disabled={loading}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}

export default NovaCompra;