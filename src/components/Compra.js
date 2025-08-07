import React from 'react';
import DetalheProduto from './DetalheProduto';

const Compra = ({ compra }) => {
  const { compra_atual, compras_anteriores } = compra;

  return (
    <div>
      <h1>Compra Atual</h1>
      <p>ID: {compra_atual.id}</p>
      <p>Data da Compra: {compra_atual.data_compra}</p>
      <p>Valor Total: R$ {compra_atual.valor_total}</p>
      <p>Status da Compra: {compra_atual.status_compra}</p>

      <DetalheProduto compra={compra} />

      <h2>Compras Anteriores</h2>
      {compras_anteriores.map((compra_anterior, index) => (
        <div key={index}>
          <p>ID: {compra_anterior.id}</p>
          <p>Data da Compra: {compra_anterior.data_compra}</p>
          <p>Valor Total: R$ {compra_anterior.valor_total}</p>
          <p>Status da Compra: {compra_anterior.status_compra}</p>
        </div>
      ))}
    </div>
  );
};

export default Compra;