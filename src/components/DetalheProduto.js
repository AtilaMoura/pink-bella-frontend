import React from 'react';

const DetalheProduto = ({ compra }) => {
  const { itens } = compra.compra_atual;

  return (
    <div>
      <h2>Detalhe do Produto</h2>
      {itens.map((item, index) => (
        <div key={index}>
          <h3>{item.produto.nome}</h3>
          <p>Quantidade: {item.quantidade}</p>
          <p>Preço Unitário: R$ {item.preco_unitario_na_compra}</p>
          <p>Subtotal: R$ {item.subtotal_item}</p>
        </div>
      ))}
    </div>
  );
};

export default DetalheProduto;