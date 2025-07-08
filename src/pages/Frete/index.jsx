// src/pages/Frete/index.jsx
import React, { useState } from 'react';
import { calcularFrete } from '../../controllers/freteController';
import MostrarEndereco from '../../components/MostrarEndereco';
import { Link } from 'react-router-dom';

function FretePage() {
  const [cepDestino, setCepDestino] = useState('');
  const [itensFrete, setItensFrete] = useState([
    { produto_id: 1, quantidade: 1 }
  ]);
  const [resultadoFrete, setResultadoFrete] = useState(null);
  const [enderecoFrete, setEnderecoFrete] = useState(null); // Vai guardar o endereço retornado do backend
  const [erroFrete, setErroFrete] = useState('');
  const [loadingFrete, setLoadingFrete] = useState(false);

  const handleCalcularFrete = async (e) => {
    e.preventDefault();

    const cleanedCep = cepDestino.replace(/\D/g, '');
    console.log('CEP de destino limpo a ser enviado para o backend:', cleanedCep);
    console.log('Itens a serem enviados para o backend:', itensFrete);

    if (!cleanedCep || cleanedCep.length !== 8) {
      const errorMessage = 'Por favor, insira um CEP de destino válido (8 dígitos numéricos).';
      setErroFrete(errorMessage);
      setResultadoFrete(null);
      setEnderecoFrete(null);
      console.log('Erro de validação do CEP no frontend:', errorMessage);
      return;
    }

    setLoadingFrete(true);
    setErroFrete('');
    setResultadoFrete(null);
    setEnderecoFrete(null);

    try {
      console.log('Chamando calcularFrete no freteController...');
      const response = await calcularFrete(cleanedCep, itensFrete);
      
      console.log('Resposta COMPLETA recebida do backend:', response);
      console.log('Opções de frete (response.opcoes_frete):', response.opcoes_frete);
      console.log('Endereço de destino (response.enderecoDestino):', response.enderecoDestino); // Esperando vir do backend

      if (response && response.opcoes_frete) {
        setResultadoFrete(response.opcoes_frete);
      } else {
        console.warn('Resposta do backend não contém "opcoes_frete" ou é nula/indefinida.');
        setResultadoFrete([]);
      }

      // Agora, esperamos que 'enderecoDestino' venha do backend
      if (response && response.enderecoDestino) {
        setEnderecoFrete(response.enderecoDestino);
      } else {
        console.warn('Resposta do backend não contém "enderecoDestino" ou é nula/indefinida.');
        setEnderecoFrete(null);
      }

    } catch (error) {
      console.error('Erro ao calcular frete no frontend (catch block):', error);
      const errorMessage = error.response?.data?.message || 'Erro ao calcular frete. Verifique o CEP e os itens.';
      setErroFrete(errorMessage);
      console.log('Mensagem de erro definida para exibição:', errorMessage);
    } finally {
      setLoadingFrete(false);
      console.log('Finalizado o processo de cálculo de frete.');
    }
  };

  const handleAddItem = () => {
    setItensFrete([...itensFrete, { produto_id: '', quantidade: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItens = [...itensFrete];
    newItens[index][field] = value;
    setItensFrete(newItens);
  };

  const handleRemoveItem = (indexToRemove) => {
    const filteredItens = itensFrete.filter((_, index) => index !== indexToRemove);
    setItensFrete(filteredItens);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Calculadora de Frete</h2>
        <Link to="/" className="btn btn-secondary">Voltar para Home</Link>
      </div>

      <div className="card shadow-sm text-start mb-5">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Informações para Cálculo</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleCalcularFrete}>
            <div className="mb-3">
              <label htmlFor="cepDestino" className="form-label">CEP de Destino:</label>
              <input
                type="text"
                className="form-control"
                id="cepDestino"
                placeholder="Apenas números, ex: 55190052"
                value={cepDestino}
                onChange={(e) => setCepDestino(e.target.value.replace(/\D/g, ''))}
                maxLength="8"
              />
              {erroFrete && <div className="text-danger mt-1">{erroFrete}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Itens (Produto ID e Quantidade):</label>
              {itensFrete.map((item, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="ID do Produto"
                    value={item.produto_id}
                    onChange={(e) => handleItemChange(index, 'produto_id', e.target.value)}
                    min="1"
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Quantidade"
                    value={item.quantidade}
                    onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)}
                    min="1"
                  />
                  <button type="button" className="btn btn-outline-danger" onClick={() => handleRemoveItem(index)}>
                    Remover
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleAddItem}>
                Adicionar Item
              </button>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loadingFrete}>
              {loadingFrete ? 'Calculando...' : 'Calcular Frete'}
            </button>
          </form>

          {resultadoFrete && ( 
            <div className="mt-4 p-3 border rounded bg-light">
              <h4>Resultados do Frete</h4>
              
              {/* Exibição do endereço de destino */}
              {enderecoFrete ? ( // Renderiza o MostrarEndereco APENAS se enderecoFrete tiver valor
                <>
                  <h5 className="mt-3">Endereço de Destino:</h5>
                  {/* Passa o objeto de endereço completo para MostrarEndereco */}
                  <MostrarEndereco endereco={enderecoFrete} /> 
                </>
              ) : (
                <p>Endereço de destino não disponível na resposta do servidor.</p> 
              )}

              <h5 className="mt-3">Opções de Frete:</h5>
              {resultadoFrete.length > 0 ? (
                <ul className="list-group">
                  {resultadoFrete.map((frete, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{frete.servico}</strong> ({frete.nome_transportadora || 'N/A'})
                        <br />
                        <small>Prazo: {frete.prazo_dias_uteis} dias úteis</small>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        R$ {frete.preco_frete.toFixed(2).replace('.', ',')}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhuma opção de frete encontrada para este CEP e itens.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FretePage;