// src/pages/Clientes/novo.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Importar todas as funções necessárias do seu controller
import {
  buscarClientePorId,
  criarCliente,
  atualizarCliente,
} from "../../controllers/clienteController";

function NovoCliente() {
  const [cliente, setCliente] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    endereco: {
      logradouro: "",
      cep: "",
      numero: "",
      complemento: "",
      referencia: "",
      tipo_endereco: "",
      is_principal: true,
      bairro: "",
      cidade: "",
      estado: "",
    },
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function carregarClienteParaEdicao() {
      if (id) {
        try {
          const dadosCliente = await buscarClientePorId(id);
          setCliente((prev) => ({
            ...dadosCliente,
            endereco: {
              logradouro: dadosCliente.endereco?.logradouro || "",
              cep: dadosCliente.endereco?.cep || "",
              numero: dadosCliente.endereco?.numero || "",
              complemento: dadosCliente.endereco?.complemento || "",
              referencia: dadosCliente.endereco?.referencia || "",
              tipo_endereco: dadosCliente.endereco?.tipo_endereco || "",
              is_principal: dadosCliente.endereco?.is_principal ?? true,
              bairro: dadosCliente.endereco?.bairro || "",
              cidade: dadosCliente.endereco?.cidade || "",
              estado: dadosCliente.endereco?.estado || "",
            },
          }));
        } catch (err) {
          console.error("Erro ao carregar cliente para edição:", err);
          alert("Erro ao carregar dados do cliente para edição.");
          navigate("/clientes");
        }
      } else {
        setCliente({
          nome: "",
          email: "",
          telefone: "",
          cpf: "",
          endereco: {
            logradouro: "",
            numero: "",
            complemento: "",
            referencia: "",
            tipo_endereco: "",
            is_principal: true,
            bairro: "",
            cidade: "",
            estado: "",
            cep: "",
          },
        });
      }
    }
    carregarClienteParaEdicao();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("endereco.")) {
      const campo = name.split(".")[1];
      setCliente((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [campo]: value,
        },
      }));
    } else {
      setCliente((prev) => ({ ...prev, [name]: value }));
    }
  };

  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setCliente((prev) => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              logradouro: data.logradouro || "",
              bairro: data.bairro || "",
              cidade: data.localidade || "",
              estado: data.uf || "",
            },
          }));
        } else {
          setCliente((prev) => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              logradouro: "",
              bairro: "",
              cidade: "",
              estado: "",
            },
          }));
          console.warn("CEP não encontrado ou inválido:", cepLimpo);
          alert("CEP não encontrado ou inválido. Por favor, preencha o endereço manualmente.");
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
        alert("Erro ao buscar CEP. Verifique sua conexão ou tente novamente.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await atualizarCliente(id, cliente);
        alert("Cliente atualizado com sucesso!");
        navigate("/clientes"); // Em edição, ainda volta para a lista
      } else {
        // Se não existe ID, estamos criando um novo cliente (requisição POST)
        const novoClienteSalvo = await criarCliente(cliente);

        // REMOVIDO: o alert("Cliente cadastrado com sucesso!"); anterior
        // Agora, o alert/confirm já serve como a notificação de sucesso e a opção
        const confirmar = window.confirm(
          "Cliente cadastrado com sucesso! Deseja criar uma nova compra para este cliente?"
        );

        if (confirmar) {
          // Redireciona para a página de nova compra, passando o ID do cliente
          navigate(`/compras/novo/${novoClienteSalvo.cliente.clienteId}`);
        } else {
          // Se o usuário clicar em "Cancelar", volta para a lista de clientes
          navigate("/clientes");
        }
      }
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
      // Detalhes adicionais do erro Axios (útil para depuração)
      console.error("Detalhes do erro Axios:", err.response);
      console.error("Mensagem do erro Axios:", err.message);

      const errorMessage = err.response?.data?.error || err.message || "Erro ao salvar cliente.";
      alert(`Erro ao salvar cliente: ${errorMessage}`);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Cliente" : "Novo Cliente"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="nome" className="form-label">
              Nome
            </label>
            <input
              type="text"
              className="form-control"
              id="nome"
              name="nome"
              value={cliente.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={cliente.email || ''}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="telefone" className="form-label">
              Telefone
            </label>
            <input
              type="text"
              className="form-control"
              id="telefone"
              name="telefone"
              value={cliente.telefone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="cpf" className="form-label">
              CPF
            </label>
            <input
              type="text"
              className="form-control"
              id="cpf"
              name="cpf"
              value={cliente.cpf}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <h4>Endereço Principal</h4>
        <div className="row mb-3">
          <div className="col-md-3">
            <label htmlFor="cep" className="form-label">
              CEP
            </label>
            <input
              type="text"
              className="form-control"
              id="cep"
              name="endereco.cep"
              value={cliente.endereco.cep}
              onChange={(e) => {
                handleChange(e);
                buscarCep(e.target.value);
              }}
              required
              maxLength="9"
            />
          </div>
          <div className="col-md-5">
            <label htmlFor="logradouro" className="form-label">
              Logradouro
            </label>
            <input
              type="text"
              className="form-control"
              id="logradouro"
              name="endereco.logradouro"
              value={cliente.endereco.logradouro}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="numero" className="form-label">
              Número
            </label>
            <input
              type="text"
              className="form-control"
              id="numero"
              name="endereco.numero"
              value={cliente.endereco.numero}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="complemento" className="form-label">
              Complemento
            </label>
            <input
              type="text"
              className="form-control"
              id="complemento"
              name="endereco.complemento"
              value={cliente.endereco.complemento}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="bairro" className="form-label">
              Bairro
            </label>
            <input
              type="text"
              className="form-control"
              id="bairro"
              name="endereco.bairro"
              value={cliente.endereco.bairro}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="cidade" className="form-label">
              Cidade
            </label>
            <input
              type="text"
              className="form-control"
              id="cidade"
              name="endereco.cidade"
              value={cliente.endereco.cidade}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="estado" className="form-label">
              Estado
            </label>
            <input
              type="text"
              className="form-control"
              id="estado"
              name="endereco.estado"
              value={cliente.endereco.estado}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="referencia" className="form-label">
              Referência
            </label>
            <input
              type="text"
              className="form-control"
              id="referencia"
              name="endereco.referencia"
              value={cliente.endereco.referencia}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="tipo_endereco" className="form-label">
              Tipo de Endereço
            </label>
            <input
              type="text"
              className="form-control"
              id="tipo_endereco"
              name="endereco.tipo_endereco"
              value={cliente.endereco.tipo_endereco}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-success">
          Salvar
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/clientes")}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}

export default NovoCliente;