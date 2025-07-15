// src/pages/Compras/index.jsx
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  listarCompras,
  atualizarStatusCompra,
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

  const carregarCompras = async () => {
    try {
      const dados = await listarCompras();
      setCompras(dados);
    } catch (err) {
      setError("Erro ao carregar compras.");
    } finally {
      setLoading(false);
    }
  };

  const carregarSaldo = async () => {
    try {
      const dados = await obterSaldoMelhorEnvio();
      setSaldo(dados.saldo);
      setFrete(dados.Frete);
    } catch (err) {
      console.error("Erro ao carregar saldo:", err);
    }
  };

  useEffect(() => {
    carregarCompras();
    carregarSaldo();
  }, []);

  const handleMarcarComoPago = async (compra) => {
    if (compra.status_compra === "Pago") return;
    setLoading(true);
    try {
      const atualizada = await atualizarStatusCompra(compra.id, "Pago");
      setCompras((prev) =>
        prev.map((c) => (c.id === compra.id ? atualizada : c))
      );
      setMessage(`Compra ${compra.id} marcada como 'Pago'.`);
    } catch (err) {
      setError(`Erro ao marcar compra como paga.`);
    } finally {
      setLoading(false);
    }
  };

  const handleGerarEtiqueta = async (compra) => {
    try {
      const atualizada = await atualizarStatusCompra(
        compra.id,
        "Aguardando Etiqueta"
      );
      setCompras((prev) =>
        prev.map((c) => (c.id === compra.id ? atualizada : c))
      );
    } catch (err) {
      console.error("Erro ao gerar etiqueta:", err);
    }
  };

  const abrirPagamentoPix = async () => {
    try {
      const pix = await gerarPixParaCarrinho();
      setPagamentoPix(pix);
      setVerificandoPagamento(true);
    } catch (err) {
      setError("Erro ao gerar PIX para pagamento do carrinho.");
    }
  };

  useEffect(() => {
    if (verificandoPagamento) {
      const intervalo = setInterval(async () => {
        const dados = await obterSaldoMelhorEnvio();
        setSaldo(dados.saldo);
        if (dados.saldo >= dados.Frete) {
          clearInterval(intervalo);
          setVerificandoPagamento(false);
          await comprarEtiqueta();
          await gerarEtiqueta();
          await carregarCompras();
          await carregarSaldo();
          setPagamentoPix(null);
        }
      }, 5000);
      return () => clearInterval(intervalo);
    }
  }, [verificandoPagamento]);

  const handleGerarEtiquetasPagas = async () => {
  try {
    const etiquetasPagas = compras
      .filter(compra => compra.status_compra === "Pago" && compra.frete && compra.frete.codigo_etiqueta)
      .map(compra => compra.frete.codigo_etiqueta);

    if (etiquetasPagas.length === 0) {
      alert("Nenhuma compra com etiqueta paga encontrada.");
      return;
    }

    const resultado = await gerarEtiqueta(etiquetasPagas);
    console.log("Resultado da geração de etiquetas:", resultado);
    alert("Etiquetas enviadas para geração com sucesso!");
  } catch (error) {
    console.error("Erro ao gerar etiquetas pagas:", error);
    alert("Erro ao gerar etiquetas. Verifique o console.");
  }
};

  const comprasFiltradas = compras.filter((c) =>
    filtroStatus === "Todos" ? true : c.status_compra === filtroStatus
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Compras</h2>
        <div className="d-flex gap-3">
          <button className="btn btn-success" onClick={handleGerarEtiquetasPagas}>
  Gerar Etiquetas Pagas
</button>
          <div className="bg-light border px-3 py-2 rounded text-center">
            <strong>Saldo:</strong>
            <br />R$ {saldo.toFixed(2).replace(".", ",")}
          </div>
          <div className="bg-light border px-3 py-2 rounded text-center">
            <strong>Carrinho:</strong>
            <br />R$ {frete.toFixed(2).replace(".", ",")}
          </div>
          {frete > 0 && (
            <button
              className="btn btn-success"
              onClick={abrirPagamentoPix}
              disabled={verificandoPagamento}
            >
              Pagar Etiqueta
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
              <tr key={compra.id}>
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
                <td>R$ {compra.valor_total.toFixed(2).replace(".", ",")}</td>
                <td>
                  <span className={`badge ${
                    compra.status_compra === "Pendente"
                      ? "bg-warning text-dark"
                      : compra.status_compra === "Pago"
                      ? "bg-success"
                      : compra.status_compra === "Aguardando Etiqueta"
                      ? "bg-info text-dark"
                      : "bg-secondary"
                  }`}>
                    {compra.status_compra}
                  </span>
                </td>
                <td>
                  {compra.status_compra === "Pendente" && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleMarcarComoPago(compra)}
                    >
                      Marcar como Pago
                    </button>
                  )}
                  {compra.status_compra === "Pago" && (
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleGerarEtiqueta(compra)}
                    >
                      Gerar Etiqueta
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Compras;