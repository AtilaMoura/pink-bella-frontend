import React, { useEffect, useState } from "react";
import { format } from "date-fns";
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
  const [expanded, setExpanded] = useState({});

  const carregarCompras = async () => {
    try {
      const dados = await listarCompras();
      setCompras(dados);
    } catch {
      setError("Erro ao carregar compras.");
    } finally {
      setLoading(false);
    }
  };

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
    carregarCompras();
    carregarSaldo();
    atualizarRastreio();
  }, []);

  const handleMarcarVariasComoPagas = async () => {
    const pendentes = compras.filter(
      (c) => selecionadas.includes(c.id) && c.status_compra === "Pendente"
    );
    for (const compra of pendentes) {
      try {
        await atualizarStatusCompra(compra.id, "Pago");
        await carregarSaldo();
      } catch (error) {
        console.error("Erro ao atualizar status da compra:", error);
      }
    }
    await carregarCompras();
    setMessage("Compras marcadas como pagas com sucesso.");
  };

  const handleGerarEtiquetasSelecionadas = async () => {
    try {
      const etiquetas = compras
        .filter(
          (c) =>
            selecionadas.includes(c.id) &&
            c.status_compra === "Aguardando Etiqueta" &&
            c.codigo_etiqueta
        )
        .map((c) => c.codigo_etiqueta);

      if (etiquetas.length === 0) {
        alert("Nenhuma etiqueta disponível para gerar.");
        return;
      }

      await gerarEtiqueta(etiquetas);
      await carregarSaldo();
      setMessage("Etiquetas geradas com sucesso.");
      await carregarCompras();
    } catch {
      alert("Erro ao gerar etiquetas.");
    }
  };

  const handlePagamento = async () => {
    try {
      const compra = compras.find((c) => selecionadas.includes(c.id));
      if (saldo >= compra.frete.valor) {
        await comprarEtiqueta();
        await gerarEtiqueta([compra.codigo_etiqueta]);
        setMessage("Etiqueta paga e gerada com sucesso.");
        await carregarCompras();
      } else {
        const pix = await gerarPixParaCarrinho(compra.frete.valor);
        setPagamentoPix(pix);
        setVerificandoPagamento(true);
      }
    } catch (error) {
      console.error("Erro ao pagar etiqueta:", error);
    }
  };

  useEffect(() => {
    if (verificandoPagamento) {
      const intervalo = setInterval(async () => {
        const dados = await obterSaldoMelhorEnvio();
        setSaldo(dados.saldo);
        if (dados.saldo >= frete) {
          clearInterval(intervalo);
          setVerificandoPagamento(false);
          try {
            const compra = compras.find((c) => selecionadas.includes(c.id));
            await comprarEtiqueta();
            await gerarEtiqueta([compra.codigo_etiqueta]);
            setMessage("Etiqueta paga e gerada com sucesso.");
            await carregarCompras();
            setPagamentoPix(null);
          } catch (error) {
            console.error("Erro ao pagar etiqueta:", error);
          }
        }
      }, 5000);
      return () => clearInterval(intervalo);
    }
  }, [verificandoPagamento, compras, frete, selecionadas]);

  const comprasFiltradas = compras.filter((c) =>
    filtroStatus === "Todos" ? true : c.status_compra === filtroStatus
  );

  const handleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const gerarLinkImpressao = async (codigoEtiqueta) => {
    try {
      const response = await fetch('http://localhost:3000/melhor-envio/imprimir-etiquetas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orders: [codigoEtiqueta],
          mode: 'public',
        }),
      });
      const data = await response.json();
      window.open(data.url, '_blank');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Compras</h2>
      </div>

      <div className="d-flex gap-4 mb-3">
        <div className="bg-light border px-3 py-2 rounded text-center">
          <strong>Saldo:</strong>
          <br />R$ {saldo.toFixed(2).replace(".", ",")}
        </div>
        <div className="bg-light border px-3 py-2 rounded text-center">
          <strong>Carrinho:</strong>
          <br />R$ {frete.toFixed(2).replace(".", ",")}
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
            onClick={() =>
              navigator.clipboard.writeText(pagamentoPix.codigoParaCopiar)
            }
          >
            Copiar código PIX
          </button>
        </div>
      )}

      <div className="mb-3">
        <label>Status:</label>
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
                  <td>{
                    compra.data_compra
                      ? format(new Date(compra.data_compra), "dd/MM/yyyy HH:mm")
                      : "-"
                  }</td>
                  <td>{compra.cliente?.nome || "-"}</td>
                  <td>R$ {compra.valor_total?.toFixed(2).replace(".", ",")}</td>
                  <td>
                    <span
                      className={`badge px-2 py-1 ${
                        compra.status_compra === "Pendente"
                          ? "bg-warning text-dark"
                          : compra.status_compra === "Pago"
                          ? "bg-success"
                          : compra.status_compra === "Aguardando Etiqueta"
                          ? "bg-info text-dark"
                          : compra.status_compra === "Etiqueta PDF Gerada"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {compra.status_compra}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-link"
                      onClick={() => handleExpand(compra.id)}
                    >
                      <i className="fas fa-angle-down"></i>
                    </button>
                  </td>
                </tr>
                {expanded[compra.id] && (
                  <tr>
                    <td colSpan={7}>
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Detalhes da Compra</h5>
                          <p className="card-text">
                            <strong>Cliente:</strong> {compra.cliente?.nome}
                          </p>
                          <p className="card-text">
                            <strong>Endereço:</strong>{" "}
                            {compra.endereco_entrega?.logradouro},{" "}
                            {compra.endereco_entrega?.numero},{" "}
                            {compra.endereco_entrega?.bairro},{" "}
                            {compra.endereco_entrega?.cidade},{" "}
                            {compra.endereco_entrega?.estado}
                          </p>
                          <p className="card-text">
                            <strong>Valor Total:</strong> R${" "}
                            {compra.valor_total?.toFixed(2).replace(".", ",")}
                          </p>
                          {compra.status_compra === "Etiqueta PDF Gerada" && (
                            <button
                              className="btn btn-primary ms-2"
                              onClick={() => gerarLinkImpressao(compra.codigo_etiqueta)}
                            >
                              Gerar Link de Impressão
                            </button>
                          )}
                          <button className="btn btn-primary">
                            Detalhes da Compra
                          </button>
                          {compra.status_compra === "Pendente" && (
                            <button
                              className="btn btn-danger ms-2"
                              onClick={() => handleMarcarVariasComoPagas()}
                            >
                              Cancelar Compra
                            </button>
                          )}
                          {compra.status_compra === "Aguardando Etiqueta" && (
                            <button
                              className="btn btn-success ms-2"
                              onClick={handleGerarEtiquetasSelecionadas}
                            >
                              Gerar Etiqueta
                            </button>
                          )}
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
          }}
        >
          {compras.some(
            (c) =>
              selecionadas.includes(c.id) && c.status_compra === "Pendente"
          ) && (
            <button
              className="btn btn-outline-success me-2"
              onClick={handleMarcarVariasComoPagas}
            >
              Marcar como Pagas
            </button>
          )}
          {compras.some(
            (c) =>
              selecionadas.includes(c.id) &&
              c.status_compra === "Aguardando Etiqueta"
          ) && (
            <button
              className="btn btn-outline-primary me-2"
              onClick={handleGerarEtiquetasSelecionadas}
            >
              Gerar Etiquetas
            </button>
          )}
          {compras.some(
            (c) =>
              selecionadas.includes(c.id) && c.status_compra === "Pagar Etiqueta"
          ) && (
            <button
              className="btn btn-success me-2"
              onClick={handlePagamento}
            >
              Pagar Etiqueta
            </button>
          )}
          <button
            className="btn btn-danger"
            onClick={() => setSelecionadas([])}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

export default Compras;