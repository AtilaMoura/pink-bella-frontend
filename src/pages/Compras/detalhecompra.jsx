import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Line, Pie, Bar } from 'recharts';

function DetalheCompra() {
  const { id } = useParams();
  const [compra, setCompra] = useState({});
  const [cliente, setCliente] = useState({});
  const [itens, setItens] = useState([]);
  const [graficos, setGraficos] = useState({});

  useEffect(() => {
    // Buscar dados da compra
    fetch(`/compras/${id}`)
      .then(response => response.json())
      .then(data => {
        setCompra(data);
        setCliente(data.cliente);
        setItens(data.itens);
      });
  }, [id]);

  // Função para calcular ticket médio
  const calcularTicketMedio = () => {
    // Lógica para calcular ticket médio
  };

  // Função para calcular total gasto
  const calcularTotalGasto = () => {
    // Lógica para calcular total gasto
  };

  return (
    <div>
      {/* Dados Principais da Compra */}
      <h1>Detalhe da Compra #{compra.id}</h1>
      <p>Data e hora da compra: {compra.data_compra}</p>
      <p>Status da compra: {compra.status_compra}</p>
      {/* ... */}

      {/* Dados do Cliente */}
      <h2>Dados do Cliente</h2>
      <p>Nome completo: {cliente.nome}</p>
      <p>CPF: {cliente.cpf}</p>
      {/* ... */}

      {/* Lista de Itens da Compra */}
      <h2>Itens da Compra</h2>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Tamanho</th>
            <th>Quantidade</th>
            <th>Preço unitário</th>
            <th>Total item</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item, index) => (
            <tr key={index}>
              <td>{item.produto.nome}</td>
              <td>{item.produto.categoria}</td>
              <td>{item.tamanho}</td>
              <td>{item.quantidade}</td>
              <td>R$ {item.preco_unitario.toFixed(2).replace(".", ",")}</td>
              <td>R$ {item.total_item.toFixed(2).replace(".", ",")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Gráficos e Indicadores */}
      <h2>Gráficos e Indicadores</h2>
      <Line data={graficos.historicoCompras} />
      <Pie data={graficos.categoriasMaisCompradas} />
      <Bar data={graficos.gastoPorCompra} />

      {/* Ações do Admin */}
      <h2>Ações do Admin</h2>
      <button>Reenviar confirmação por WhatsApp ou e-mail</button>
      <button>Atualizar código de rastreio</button>
      {/* ... */}
    </div>
  );
}

export default DetalheCompra;