import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { buscarCompraPorId } from '../../controllers/compraController';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function DetalheCompra() {
  const { id } = useParams();
  const [compra, setCompra] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const navigate = useNavigate();

  const compraCarregar = async () => {
    try {
      const dados = await buscarCompraPorId(id);
      setCompra({
        ...dados?.compra_atual,
        compras_anteriores: dados?.compras_anteriores || []
      });
      setCarregando(false);
    } catch (err) {
      console.error('Erro ao carregar compra:', err);
      setCarregando(false);
    }
  };

  useEffect(() => {
    compraCarregar();
  }, []);

  useEffect(() => {
    if (id) {
      compraCarregar();
    }
  }, [id]);

  if (carregando) return <div className="text-center mt-4">Carregando...</div>;
  if (!compra || !compra.id) return <div className="alert alert-danger">Compra não encontrada</div>;

  const copiarRastreio = () => {
    navigator.clipboard.writeText(compra.codigo_rastreio);
    alert('Link de rastreio copiado!');
  };

  const comprasAnterioresChartData = compra.compras_anteriores?.map(compra => ({
    name: `Compra #${compra.id}`,
    value: compra.valor_total,
  }));

  const itensCompradosChartData = compra.compras_anteriores?.reduce((acc, compra) => {
    compra.itens.forEach(item => {
      const produto = acc.find(p => p.name === item.produto.nome);
      if (produto) {
        produto.value += item.quantidade;
      } else {
        acc.push({ name: item.produto.nome, value: item.quantidade });
      }
    });
    return acc;
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Detalhes da Compra #{compra.id}</h2>

      {/* Informações da Compra e Cliente */}
      <div className="row mb-3">
        {/* Info da Compra - Exibido como card em mobile, como div em desktop */}
        <div className="col-md-6">
          <div className="card shadow-sm d-block d-md-none">
            <div className="card-body">
              <h5 className="card-title">Informações da Compra</h5>
              <p><strong>Data:</strong> {compra.data_compra}</p>
              <p><strong>Status:</strong> {compra.status_compra}</p>
              <p><strong>Valor Total:</strong> R$ {compra.valor_total.toFixed(2).replace('.', ',')}</p>
              {compra.codigo_rastreio && (
                <p>
                  <strong>Rastreio:</strong>{' '}
                  <a href={compra.codigo_rastreio} target="_blank" rel="noopener noreferrer">Ver rastreio</a>
                  <button className="btn btn-sm btn-outline-secondary ms-2" onClick={copiarRastreio}>
                    Copiar
                  </button>
                </p>
              )}
              {compra.url_melhor_envio && (
                <p>
                  <strong>Etiqueta:</strong>{' '}
                  <a href={compra.url_melhor_envio} target="_blank" rel="noopener noreferrer">
                    Imprimir etiqueta
                  </a>
                </p>
              )}
            </div>
          </div>
          <div className="d-none d-md-block p-3">
            <h5 className="mb-3">Informações da Compra</h5>
            <p><strong>Data:</strong> {compra.data_compra}</p>
            <p><strong>Status:</strong> {compra.status_compra}</p>
            <p><strong>Valor Total:</strong> R$ {compra.valor_total.toFixed(2).replace('.', ',')}</p>
            {compra.codigo_rastreio && (
              <p>
                <strong>Rastreio:</strong>{' '}
                <a href={compra.codigo_rastreio} target="_blank" rel="noopener noreferrer">Ver rastreio</a>
                <button className="btn btn-sm btn-outline-secondary ms-2" onClick={copiarRastreio}>
                  Copiar
                </button>
              </p>
            )}
            {compra.url_melhor_envio && (
              <p>
                <strong>Etiqueta:</strong>{' '}
                <a href={compra.url_melhor_envio} target="_blank" rel="noopener noreferrer">
                  Imprimir etiqueta
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Info do Cliente - Exibido como card em mobile, como div em desktop */}
        <div className="col-md-6">
          <div className="card shadow-sm d-block d-md-none">
            <div className="card-body">
              <h5 className="card-title">Cliente</h5>
              <p><strong>Nome:</strong> {compra.cliente?.nome}</p>
              <p><strong>Telefone:</strong> {compra.cliente?.telefone}</p>
              <p><strong>Email:</strong> {compra.cliente?.email || 'Não informado'}</p>
            </div>
          </div>
          <div className="d-none d-md-block p-3">
            <h5 className="mb-3">Cliente</h5>
            <p><strong>Nome:</strong> {compra.cliente?.nome}</p>
            <p><strong>Telefone:</strong> {compra.cliente?.telefone}</p>
            <p><strong>Email:</strong> {compra.cliente?.email || 'Não informado'}</p>
          </div>
        </div>
      </div>

      {/* Endereço e Frete */}
      <div className="row mb-3">
        {/* Endereço - Exibido como card em mobile, como div em desktop */}
        <div className="col-md-6">
          <div className="card shadow-sm d-block d-md-none">
            <div className="card-body">
              <h5 className="card-title">Endereço de Entrega</h5>
              <p><strong>CEP:</strong> {compra.endereco?.cep}</p>
              <p><strong>Endereço:</strong> {compra.endereco?.logradouro}, {compra.endereco?.numero}</p>
              <p><strong>Bairro:</strong> {compra.endereco?.bairro}</p>
              {compra.endereco?.complemento && (
                <p><strong>Complemento:</strong> {compra.endereco?.complemento}</p>
              )}
              {compra.endereco?.referencia && (
                <p><strong>Referência:</strong> {compra.endereco?.referencia}</p>
              )}
            </div>
          </div>
          <div className="d-none d-md-block p-3">
            <h5 className="mb-3">Endereço de Entrega</h5>
            <p><strong>CEP:</strong> {compra.endereco?.cep}</p>
            <p><strong>Endereço:</strong> {compra.endereco?.logradouro}, {compra.endereco?.numero}</p>
            <p><strong>Bairro:</strong> {compra.endereco?.bairro}</p>
            {compra.endereco?.complemento && (
              <p><strong>Complemento:</strong> {compra.endereco?.complemento}</p>
            )}
            {compra.endereco?.referencia && (
              <p><strong>Referência:</strong> {compra.endereco?.referencia}</p>
            )}
          </div>
        </div>

        {/* Frete - Exibido como card em mobile, como div em desktop */}
        <div className="col-md-6">
          <div className="card shadow-sm d-block d-md-none">
            <div className="card-body">
              <h5 className="card-title">Frete</h5>
              <p><strong>Transportadora:</strong> {compra.frete?.transportadora}</p>
              <p><strong>Serviço:</strong> {compra.frete?.servico}</p>
              <p><strong>Prazo:</strong> {compra.frete?.prazo_dias_uteis + 1} dias úteis</p>
              <p><strong>Valor:</strong> R$ {compra.frete?.valor.toFixed(2).replace('.', ',')}</p>
            </div>
          </div>
          <div className="d-none d-md-block p-3">
            <h5 className="mb-3">Frete</h5>
            <p><strong>Transportadora:</strong> {compra.frete?.transportadora}</p>
            <p><strong>Serviço:</strong> {compra.frete?.servico}</p>
            <p><strong>Prazo:</strong> {compra.frete?.prazo_dias_uteis + 1} dias úteis</p>
            <p><strong>Valor:</strong> R$ {compra.frete?.valor.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
      </div>

      <div className='row'>  
        <div className='col-4'>     
          {/* Itens da Compra - Exibido como card em mobile, como div em desktop */}
          <div className="card shadow-sm mb-4 d-block d-md-none">
            <div className="card-body">
              <h5 className="card-title">Itens da Compra</h5>
              <ul className="list-group">
                {compra.itens.map(item => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{item.produto?.nome}</strong> – {item.quantidade} un
                      <br />
                      <small>Preço unitário: R$ {item.preco_unitario_na_compra.toFixed(2).replace('.', ',')}</small>
                    </div>
                    <span className="badge bg-primary rounded-pill">
                      R$ {item.subtotal_item.toFixed(2).replace('.', ',')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="d-none d-md-block p-3 mb-4">
            <h5 className="mb-3">Itens da Compra</h5>
            <ul className="list-group">
              {compra.itens.map(item => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{item.produto?.nome}</strong> – {item.quantidade} un
                    <br />
                    <small>Preço unitário: R$ {item.preco_unitario_na_compra.toFixed(2).replace('.', ',')}</small>
                  </div>
                  <span className="badge bg-primary rounded-pill">
                    R$ {item.subtotal_item.toFixed(2).replace('.', ',')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='col-7'> 
          {/* Iframe do Rastreio - Exibido como card em mobile, como div em desktop */}
          {compra.codigo_rastreio && (
            <div className="card shadow-sm mb-4 d-block d-md-none">
              <div className="card-body">
                <h5 className="card-title">Rastreamento</h5>
                <iframe
                  src={compra.codigo_rastreio}
                  className="w-100"
                  style={{ height: '500px', border: '1px solid #ccc', borderRadius: '8px' }}
                  title="Rastreamento"
                />
              </div>
            </div>
          )}
          {compra.codigo_rastreio && (
            <div className="d-none d-md-block p-3 mb-4">
              <h5 className="mb-3">Rastreamento</h5>
              <iframe
                src={compra.codigo_rastreio}
                className="w-100"
                style={{ height: '500px', border: '1px solid #ccc', borderRadius: '8px' }}
                title="Rastreamento"
              />
            </div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h5>Compras Anteriores (Valor Total)</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comprasAnterioresChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="col-md-6">
          <h5>Itens Comprados</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={itensCompradosChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compras Anteriores - Exibido como card em mobile, como div em desktop */}
      {compra.compras_anteriores?.length > 0 && (
        <div className="card shadow-sm mb-5 d-block d-md-none">
          <div className="card-body">
            <h5 className="card-title">Compras Anteriores</h5>
            <ul className="list-group">
              {compra.compras_anteriores.map(comp => (
                <li
                  key={comp.id}
                  className="list-group-item list-group-item-action"
                  onClick={() => navigate(`/compras/detalhe/${comp.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <p><strong>Compra #{comp.id}</strong> – {comp.data_compra}</p>
                  <p>Status: {comp.status_compra}</p>
                  <p>Valor Total: R$ {comp.valor_total.toFixed(2).replace('.', ',')}</p>
                  {comp.itens.map((item, index) => (
                    <div key={index}>
                      <span>- {item.produto?.nome} ({item.quantidade} un)</span>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {compra.compras_anteriores?.length > 0 && (
        <div className="d-none d-md-block p-3 mb-5">
          <h5 className="mb-3">Compras Anteriores</h5>
          <ul className="list-group">
            {compra.compras_anteriores.map(comp => (
              <li
                key={comp.id}
                className="list-group-item list-group-item-action"
                onClick={() => navigate(`/compras/detalhe/${comp.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <p><strong>Compra #{comp.id}</strong> – {comp.data_compra}</p>
                <p>Status: {comp.status_compra}</p>
                <p>Valor Total: R$ {comp.valor_total.toFixed(2).replace('.', ',')}</p>
                {comp.itens.map((item, index) => (
                  <div key={index}>
                    <span>- {item.produto?.nome} ({item.quantidade} un)</span>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DetalheCompra;