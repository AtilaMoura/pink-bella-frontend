// src/components/MostrarEndereco.jsx
import React from 'react';

// Este componente agora recebe o objeto 'endereco' diretamente como prop
function MostrarEndereco({ endereco }) {
  // Se o endereço for nulo ou vazio, exibe uma mensagem
  if (!endereco || Object.keys(endereco).length === 0) {
    return <p>Endereço não disponível.</p>;
  }

  // Desestrutura as propriedades do objeto 'endereco'
  // Note que aqui as chaves devem corresponder ao que seu backend envia
  // (ex: 'logradouro', 'bairro', 'cidade', 'estado', 'cep')
  const { logradouro, bairro, cidade, estado, cep } = endereco;
  // Se seu backend envia 'rua' em vez de 'logradouro', ajuste aqui.
  // Se tiver 'numero' ou 'complemento', adicione-os também!

  return (
    <div className="card-text text-start">
      <p className="mb-0"><strong>CEP:</strong> {cep}</p>
      <p className="mb-0"><strong>Rua:</strong> {logradouro}</p>
      {/* Se houver numero ou complemento, adicione-os assim: */}
      {/* {endereco.numero && <p className="mb-0"><strong>Número:</strong> {endereco.numero}</p>} */}
      {/* {endereco.complemento && <p className="mb-0"><strong>Complemento:</strong> {endereco.complemento}</p>} */}
      <p className="mb-0"><strong>Bairro:</strong> {bairro}</p>
      <p className="mb-0"><strong>Cidade:</strong> {cidade} - {estado}</p>
    </div>
  );
}

export default MostrarEndereco;