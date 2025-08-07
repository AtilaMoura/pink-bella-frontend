import React, { useEffect, useState, useContext } from "react";
import { CompraContext } from './CompraContext';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import '../../styles/color.css';
import {
  listarCompras,
  atualizarStatusCompra,
  atualizarRastreio,
} from "../../controllers/compraController";
import {
  obterSaldoMelhorEnvio,
  gerarPixParaCarrinho,
  comprarEtiqueta,
  gerarEtiqueta,
} from "../../controllers/freteController";

function Compras() {

 const { comprasT, setComprasT, carregarComprasT } = useContext(CompraContext);
  
  const navigate = useNavigate();

  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [saldo, setSaldo] = useState(0);
  const [frete, setFrete] = useState(0);
  const [pagamentoPix, setPagamentoPix] = useState(null);
  const [verificandoPagamento, setVerificandoPagamento] = useState(false);
  const [selecionadas, setSelecionadas] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [expanded, setExpanded] = useState({});
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printUrl, setPrintUrl] = useState("");

  

  const carregarSaldo = async () => {
    try {
      const dados = await obterSaldoMelhorEnvio();
      setSaldo(dados.saldo || 0);
      setFrete(dados.Frete || 0);
    } catch (err) {
      console.error("Erro ao carregar saldo:", err);
    }
  };

  useEffect(() => {
    carregarComprasT();
    carregarSaldo();
    atualizarRastreio();
  }, []);

  useEffect(() => {
  setCompras(comprasT);
}, [comprasT]);

  const handleMarcarComoPago = async (compraId) => {
    try {
      const atualizada = await atualizarStatusCompra(compraId, "Pago");
      setCompras((prev) =>
        prev.map((c) => (c.id === compraId ? atualizada : c))
      );
      setMessage(`Compra ${compraId} marcada como 'Pago'.`);
      await carregarSaldo(); 
      await carregarComprasT();
    } catch (err) {
      setError(`Erro ao marcar compra como paga.`);
    }
  };

  const handleCancelarCompra = async (compraId) => {
    if (window.confirm("Tem certeza que deseja cancelar esta compra?")) {
      try {
        const atualizada = await atualizarStatusCompra(compraId, "Cancelado");
        setCompras((prev) =>
          prev.map((c) => (c.id === compraId ? atualizada : c))
        );
        await carregarComprasT();
        setMessage(`Compra ${compraId} cancelado com sucesso.`);
      } catch (err) {
        setError(`Erro ao cancelar compra.`);
      }
    }
  };

  const handleGerarEtiquetaIndividual = async (compra) => {
    try {
      if (compra.status_compra !== "Aguardando Etiqueta") {
        await atualizarStatusCompra(compra.id, "Aguardando Etiqueta");
      }
      if (compra.codigo_etiqueta) {
        await gerarEtiqueta([compra.codigo_etiqueta]);
        setMessage("Etiqueta gerada com sucesso!");
        carregarComprasT(); 
      } else {
        alert("Código de etiqueta não disponível para esta compra.");
      }
    } catch (err) {
      console.error("Erro ao gerar etiqueta individual:", err);
      alert("Erro ao gerar etiqueta. Verifique o console.");
    }
  };

  const handleGerarEtiquetasEmLote = async () => {
    const etiquetasParaGerar = compras
      .filter(
        (c) =>
          selecionadas.includes(c.id) &&
          c.status_compra === "Aguardando Etiqueta" &&
          c.codigo_etiqueta
      )
      .map((c) => c.codigo_etiqueta);

    if (etiquetasParaGerar.length === 0) {
      alert("Nenhuma compra selecionada com status 'Aguardando Etiqueta' e código de etiqueta válido.");
      return;
    }

    try {
      await gerarEtiqueta(etiquetasParaGerar);
      setMessage("Etiquetas em lote geradas com sucesso!");
      carregarComprasT();
    } catch (err) {
      console.error("Erro ao gerar etiquetas em lote:", err);
      alert("Erro ao gerar etiquetas em lote.");
    }
  };

  const abrirPagamentoPix = async () =>{
    const saldosC = await obterSaldoMelhorEnvio()
    
    if(saldosC.saldo >= saldosC.Frete){
    setVerificandoPagamento(true);
    }else{
      const pix = await gerarPixParaCarrinho();
      setPagamentoPix(pix);
    }
    await carregarComprasT();
    await carregarSaldo();
  }

  useEffect(() => {
    if (verificandoPagamento) {
      const intervalo = setInterval(async () => {
        const dados = await obterSaldoMelhorEnvio();
        setSaldo(dados.saldo);
        if (dados.saldo >= frete) {
          clearInterval(intervalo);
          setVerificandoPagamento(false);
          try {
            await comprarEtiqueta();
            await carregarComprasT(); 
            setMessage("Etiquetas compradas com sucesso! Agora você pode gerá-las.");
            setPagamentoPix(null);
          } catch (error) {
            console.error("Erro ao finalizar compra de etiquetas:", error);
            setError("Erro ao finalizar compra de etiquetas.");
          }
        }
      }, 5000);
      return () => clearInterval(intervalo);
    }
  }, [verificandoPagamento, frete]);

  const comprasFiltradas = compras.filter((c) => {
  const statusMatch = filtroStatus === "Todos" || c.status_compra === filtroStatus;
  const textoMatch = filtroTexto === "" || (
    (c.cliente && c.cliente.nome && c.cliente.nome.toLowerCase().includes(filtroTexto.toLowerCase())) ||
    (c.cliente && c.cliente.cpf && c.cliente.cpf.includes(filtroTexto)) ||
    (c.id && c.id.toString().includes(filtroTexto))
  );
  return statusMatch && textoMatch;
});

  const statusCounts = compras.reduce((acc, compra) => {
    if (!acc[compra.status_compra]) {
      acc[compra.status_compra] = 0;
    }
    acc[compra.status_compra]++;
    return acc;
  }, {});

  const handleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGerarLinkImpressao = async (compraId) => {
    try {
      const compra = compras.find(c => c.id === compraId);
      if (!compra || !compra.codigo_etiqueta) {
        alert("Compra ou código de etiqueta não encontrado.");
        return;
      }
      const response = await fetch("http://localhost:3000/melhor-envio/imprimir-etiquetas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orders: [compra.codigo_etiqueta],
          mode: "public",
        }),
      });
      const data = await response.json();
      if (data.url) {
        setPrintUrl(data.url);
        setShowPrintModal(true);
      } else {
        alert("Não foi possível gerar o link de impressão.");
      }
    } catch (error) {
      console.error("Erro ao gerar link de impressão:", error);
      alert("Erro ao gerar link de impressão.");
    }
  };

  const handleGerarLinkImpressaoEmLote = async () => {
    const etiquetasParaImprimir = compras
      .filter(
        (c) =>
          selecionadas.includes(c.id) &&
          c.status_compra === "Etiqueta PDF Gerada" &&
          c.codigo_etiqueta
      )
      .map((c) => c.codigo_etiqueta);

    if (etiquetasParaImprimir.length === 0) {
      alert("Nenhuma compra selecionada com status 'Etiqueta PDF Gerada' e código de etiqueta válido para impressão.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/melhor-envio/imprimir-etiquetas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orders: etiquetasParaImprimir,
          mode: "public",
        }),
      });
      const data = await response.json();
      if (data.url) {
        setPrintUrl(data.url);
        setShowPrintModal(true);
      } else {
        alert("Não foi possível gerar o link de impressão em lote.");
      }
    } catch (error) {
      console.error("Erro ao gerar link de impressão em lote:", error);
      alert("Erro ao gerar link de impressão em lote.");
    }
  };

  const statusToClass = {
"Pendente": "status-pendente",
"Pago": "status-pago",
"Aguardando Etiqueta": "status-aguardando-etiqueta",
"Etiqueta PDF Gerada": "status-etiqueta-gerada",
"Postado": "status-postado",
"Entregue": "status-entregue",
"Finalizado": "status-finalizado",
"Cancelado": "status-cancelado"
};

  return (
    <div style={{ backgroundColor: "#FFC5C5" }} className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          {Object.keys(statusCounts).map((status) => (
            status !== "Cancelado" && (
              <span key={status} className={`badge me-2 ${statusToClass[status]}`}>
                {status}: {statusCounts[status]}
              </span>
            )
          ))}
          {filtroTexto && statusCounts["Cancelado"] && (
            <span className="badge bg-light me-2">
              Cancelado: {statusCounts["Cancelado"]}
            </span>
          )}
        </div>
        <div className="d-flex gap-4">
          <div className="bg-light border px-3 py-2 rounded text-center">
            <strong>Saldo Melhor Envio:</strong>
            <br />R$ {saldo.toFixed(2).replace(".", ",")}
          </div>
          <div className="bg-light border px-3 py-2 rounded text-center">
            <strong>Carrinho Melhor Envio:</strong>
            <br />R$ {frete.toFixed(2).replace(".", ",")}
          </div>
          {frete > 0 && (
            <button
              className="btn btn-success"
              onClick={abrirPagamentoPix}
              disabled={verificandoPagamento}
            >
              Pagar Carrinho Melhor Envio
            </button>
          )}
        </div>
      </div>
      
      {pagamentoPix && (
        <div className="alert alert-info">
          <strong>Valor: R$ {pagamentoPix.valor}</strong>
          <br />
          <img
            src={pagamentoPix.urlQrCodeImagem}
            alt="QR Code PIX"
            style={{ width: "200px", marginTop: 10 }}
          />
          <br />
          <button
            className="btn btn-outline-primary btn-sm mt-2"
            onClick={() => navigator.clipboard.writeText(pagamentoPix.codigoParaCopiar)}
          >
            Copiar código PIX
          </button>
        </div>
      )}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filtrar por Nome do Cliente, CPF ou ID do Cliente"
          value={filtroTexto}
          onChange={(e) => setFiltroTexto(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Filtrar por Status:</label>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="form-select w-auto d-inline ms-2"
        >
          <option>Todos</option>
          <option>Pendente</option>
          <option>Pago</option>
          <option>Aguardando Etiqueta</option>
          <option>Etiqueta PDF Gerada</option>
          <option>Postado</option>
          <option>Entregue</option>
          <option>Cancelado</option>
        </select>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {comprasFiltradas.map((compra) => (
              <React.Fragment key={compra.id}>
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      checked={selecionadas.includes(compra.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelecionadas((prev) => [...prev, compra.id]);
                        } else {
                          setSelecionadas((prev) =>
                            prev.filter((id) => id !== compra.id)
                          );
                        }
                      }}
                    />
                  </td>
                  <td>{compra.id}</td>
                  <td>
                    {compra.data_compra
                      ? format(new Date(compra.data_compra), "dd/MM/yyyy HH:mm")
                      : "-"}
                  </td>
                  <td>{compra.cliente?.nome || "-"}</td>
                  <td>R$ {compra.valor_total?.toFixed(2).replace(".", ",")}
                  {compra.frete?.valor && compra.status_compra === "Pago" && (
                    <span className="ms-2 badge bg-info text-dark">
                      Frete: R$ {compra.frete.valor.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                  </td>
                  <td>


<span className={`badge ${statusToClass[compra.status_compra] || "status-default"}`}>
  {compra.status_compra}
</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-link p-0"
                      onClick={() => handleExpand(compra.id)}
                      title={expanded[compra.id] ? "Recolher detalhes" : "Expandir detalhes"}
                    >
                      <i className={`bi ${expanded[compra.id] ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                    </button>
                  </td>
                </tr>
                {expanded[compra.id] && (
  <tr>
    <td colSpan={7}>
      <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
        <h5 className="text-lg font-semibold mb-2">
          🛍️ Detalhes da Compra #{compra.id}
        </h5>

        <p className="mb-1">
          <strong>👤 Cliente:</strong> {compra.cliente?.nome} ({compra.cliente?.email})
        </p>

        <p className="mb-1">
          <strong>📦 Endereço de Entrega:</strong>{" "}
          {compra.endereco_entrega?.logradouro}, {compra.endereco_entrega?.numero}
          {compra.endereco_entrega?.complemento && `, ${compra.endereco_entrega.complemento}`}
          , {compra.endereco_entrega?.bairro}, {compra.endereco_entrega?.cidade} - {compra.endereco_entrega?.estado},
          CEP: {compra.endereco_entrega?.cep}
        </p>

        <div className="mb-2">
          <strong>🛒 Itens:</strong>
          <ul className="list-disc list-inside ml-4">
  {compra.itens?.map((item, idx) => {
    return (
      <li key={idx}>
        {item.quantidade}x {item.produto?.nome} (R$ {item.subtotal_item?.toFixed(2).replace(".", ",")})
      </li>
    );
  })}
</ul>
        </div>

        {compra.frete && (
          <div className="mb-2">
            <strong>🚚 Informações do Frete:</strong><br />
            Transportadora: {compra.frete.transportadora} ({compra.frete.servico_frete})<br />
            Valor: <span className="font-medium text-green-700">R$ {compra.frete.valor.toFixed(2).replace(".", ",")}</span><br />
            Prazo: {compra.frete.prazo_frete_dias} dias úteis<br />
            {compra.codigo_rastreio && (
              <>
                Código de Rastreio:{" "}
                <a href={`${compra.codigo_rastreio}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {compra.codigo_rastreio}
                </a>
                <button
                className="px-3 py-1 text-sm btn btn-outline-primary rounded"
          onClick={() => {
            const texto = `Passando para avisar que em breve, seu pedido estará chegando até você. 🚚✨

📍 Você pode acompanhar a entrega aqui: ${compra.codigo_rastreio}

Qualquer dúvida, estou à disposição! Obrigada por escolher a Pink Bella. 💕`;
            navigator.clipboard.writeText(texto);
            alert("Mensagem copiada para a área de transferência!");
          }}
        >
          Copiar Mensagem
        </button>
        <button
  className="px-3 py-1 text-sm btn btn-outline-primary rounded"
  onClick={() => {
    const numero = compra.cliente.telefone.replace(/\D/g, ''); // Remove tudo que não for número
    

    const texto = `Olá ${compra.cliente.nome}, tudo bem? 💖

Passando para avisar que em breve, seu pedido estará chegando até você. 🚚✨

📍 Você pode acompanhar a entrega aqui: ${compra.codigo_rastreio}

Qualquer dúvida, estou à disposição! Obrigada por escolher a Pink Bella. 💕`;

    const url = `https://web.whatsapp.com/send?phone=55${numero}&text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  }}
>
  Enviar WhatsApp
</button>
              </>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {compra.status_compra === "Pendente" && (
            <button
              className="px-3 py-1 text-sm btn btn-outline-success rounded hover:bg-green-700"
              onClick={() => handleMarcarComoPago(compra.id)}
            >
              ✅ Marcar como Pago
            </button>
          )}

          {compra.status_compra === "Pago" && (
            <button
              className="px-3 py-1 text-sm btn btn-outline-warning rounded hover:bg-blue-700"
              onClick={() => handleGerarEtiquetaIndividual(compra)}
            >
              ✏️ Gerar Etiqueta
            </button>
          )}

          {compra.status_compra === "Etiqueta PDF Gerada" && compra.codigo_etiqueta && (
            <button
              className="px-3 py-1 text-sm btn btn-outline-secondary rounded hover:bg-purple-700"
              onClick={() => handleGerarLinkImpressao(compra.id)}
            >
              🖨️ Imprimir Etiqueta
            </button>
          )}

          {compra.status_compra !== "Cancelado" && (
            <button
              className="px-3 py-1 text-sm btn btn-outline-danger rounded hover:bg-red-700 "
              onClick={() => handleCancelarCompra(compra.id)}
            >
              ❌ Cancelar Compra
            </button>
          )}

          {!compra.codigo_etiqueta && (
  <button
    className="px-3 py-1 text-sm btn btn-outline-secondary rounded"
      onClick={() => navigate(`/Compras/editar/${compra.id}`)}
  >
    Editar
  </button>
)}

          <button
            className="px-3 py-1 text-sm btn btn-outline-primary rounded "
            onClick={() => navigate(`/compras/detalhe/${compra.id}`)}
          >
            🔍 Ver Detalhes Completos
          </button>
          
          
        </div>
      </div>
    </td>
  </tr>
)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {selecionadas.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            padding: "10px",
            borderTop: "1px solid #ddd",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            boxShadow: "0px -2px 10px rgba(0,0,0,0.1)"
          }}
        >
          <span className="me-3">{selecionadas.length} compra(s) selecionada(s)</span>
          {compras.some(
            (c) =>
              selecionadas.includes(c.id) && c.status_compra === "Pendente"
          ) && (
            <button
              className="btn btn-outline-success me-2"
              onClick={() => handleMarcarComoPago(selecionadas[0])} // Ação para uma única compra selecionada
            >
              Marcar como Paga (Selecionada)
            </button>
          )}
          {compras.some(
            (c) =>
              selecionadas.includes(c.id) &&
              c.status_compra === "Aguardando Etiqueta"
          ) && (
            <button
              className="btn btn-outline-primary me-2"
              onClick={handleGerarEtiquetasEmLote}
            >
              Gerar Etiquetas (Lote)
            </button>
          )}
          {compras.some(
            (c) =>
              selecionadas.includes(c.id) && c.status_compra === "Etiqueta PDF Gerada"
          ) && (
            <button
              className="btn btn-outline-info me-2"
              onClick={handleGerarLinkImpressaoEmLote}
            >
              Gerar Link Impressão (Lote)
            </button>
          )}
          <button
            className="btn btn-danger"
            onClick={() => setSelecionadas([])}
          >
            Limpar Seleção
          </button>
        </div>
      )}

      {/* Modal para exibir o link de impressão */}
      {showPrintModal && ( 
        <div className="modal" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Link para Impressão de Etiquetas</h5>
                <button type="button" className="btn-close" onClick={() => setShowPrintModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body text-center">
                <p>Clique no link abaixo para abrir a página de impressão:</p>
                <a href={printUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Abrir Link de Impressão
                </a>
                <p className="mt-3">Ou copie o link:</p>
                <input type="text" className="form-control" value={printUrl} readOnly />
                <button
                  className="btn btn-outline-secondary mt-2"
                  onClick={() => navigator.clipboard.writeText(printUrl)}
                >
                  Copiar Link
                </button>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPrintModal(false)}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Compras;