import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  fetchPaciente,
  updatePaciente,
  deletePaciente,
  addExame,
  deleteExame,
  viewAnexo,
  downloadAnexo,
} from "../slices/pacienteSlice";
import "./PacienteDetalhes.css";

const PacienteDetalhes = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { paciente, loading, error } = useSelector((state) => state.pacientes);
  const [formData, setFormData] = useState({
    nome: "",
    nomeMae: "",
    dataNasc: "",
    sexo: "",
    documento: "",
    plano: "",
    alergias: "",
    vacinas: "",
    historicoFamilia: "",
    internacoes: "",
    fone: "",
    endereco: "",
    prontuario: "",
    remedio: "",
    comorbidade: "",
  });
  const [exameData, setExameData] = useState({
    tipo: "",
    anexo: null,
    resultado: "",
    observacoes: "",
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showExameModal, setShowExameModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;
  const isAssistente = userData?.isAssistente;
  const [showDeleteExameConfirm, setShowDeleteExameConfirm] = useState(false);
  const [exameIdToDelete, setExameIdToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchPaciente(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (paciente) {
      setFormData({
        nome: paciente.nome || "",
        nomeMae: paciente.nomeMae || "",
        dataNasc: paciente.dataNasc ? paciente.dataNasc.split("T")[0] : "",
        sexo: paciente.sexo || "",
        documento: paciente.documento || "",
        plano: paciente.plano || "",
        alergias: paciente.alergias || "",
        vacinas: paciente.vacinas || "",
        historicoFamilia: paciente.historicoFamilia || "",
        internacoes: paciente.internacoes || "",
        fone: paciente.fone || "",
        endereco: paciente.endereco || "",
        prontuario: paciente.prontuario || "",
        remedio: paciente.remedio || "",
        comorbidade: paciente.comorbidade || "",
      });
    }
  }, [paciente]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome || formData.nome.length < 3) {
      newErrors.nome = "O nome deve ter pelo menos 3 caracteres.";
    }

    if (!formData.fone) {
      newErrors.fone = "O telefone é obrigatório.";
    }

    if (!formData.dataNasc) {
      newErrors.dataNasc = "A data de nascimento é obrigatória.";
    }
  
    if (!formData.sexo) {
      newErrors.sexo = "O campo sexo é obrigatório.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateExame = () => {
    const newErrors = {};
    if (!exameData.tipo) {
      newErrors.tipo = "O tipo é obrigatório.";
    }
    if (!exameData.anexo) {
      newErrors.anexo = "O anexo é obrigatório.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleExameChange = (e) => {
    const { name, value, files } = e.target;
    setExameData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await dispatch(updatePaciente({ id, pacienteData: formData }));
      setShowUpdateModal(false);
      dispatch(fetchPaciente(id)); // atualiza dados do paciente
    }
  };

  const handleExameSubmit = async (e) => {
    e.preventDefault();
    if (validateExame()) {
      const formData = new FormData();
      formData.append("tipo", exameData.tipo);
      formData.append("anexo", exameData.anexo);
      formData.append("resultado", exameData.resultado);
      formData.append("observacoes", exameData.observacoes);

      await dispatch(addExame({ id, exameData: formData }));

      setExameData({
        tipo: "",
        anexo: null,
        resultado: "",
        observacoes: "",
      });
      setShowExameModal(false);
      dispatch(fetchPaciente(id));
    }
  };

// Modifique a função para mostrar o modal de confirmação
const confirmDeleteExame = (exameId) => {
  setExameIdToDelete(exameId);
  setShowDeleteExameConfirm(true);
};

// Modifique a função de deletar exame para verificar o exameId armazenado
const handleDeleteExame = async () => {
  if (exameIdToDelete) {
    await dispatch(deleteExame({ pacienteId: id, exameId: exameIdToDelete }));
    setShowDeleteExameConfirm(false);
    setExameIdToDelete(null);
    dispatch(fetchPaciente(id));
  }
};

  const handleDeletePaciente = async () => {
    await dispatch(deletePaciente(id));
    navigate("/pacientes");
  };

  const handleViewExame = async (exameId) => {
    const url = await dispatch(viewAnexo({ pacienteId: id, exameId })).unwrap();
    window.open(url, "_blank");
  };

  const handleDownloadExame = async (exameId) => {
    const blob = await dispatch(
      downloadAnexo({ pacienteId: id, exameId })
    ).unwrap();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exame_anexo";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Ocorreu um erro: {error}</p>;

  return (
    <div>
      <Link to="/pacientes" className="topoVoltar">
        <u id="btn-voltar">Voltar para Pacientes</u>
      </Link>
      <h1 className="titulo-ficha">Ficha do Paciente</h1>
      {paciente && (
        <>
          <div className="ficha">
            <em className="botoes">
              <button
                className="btn atualizar"
                onClick={() => setShowUpdateModal(true)}
              >
                Atualizar Dados
              </button>
              {!isAssistente ? (
              <button
                id="deletar"
                onClick={() => setShowDeleteConfirm(true)}
              ></button>
              ) : (
                <span className="semAutoriza"></span>
              )}
            </em>
            <span id="paciente">
              <figure><img src="../pacient.png" alt="paciente" /></figure>
              <p><strong>{paciente.nome}</strong></p>
            </span>
            <div className="infos-paciente">
              <p><strong>Telefone:</strong> {paciente.fone}</p>
              <p><strong>Endereço:</strong> {paciente.endereco}</p>
              <p><strong>Medicamentos:</strong> {paciente.remedio}</p>
              <p><strong>Nome da Mãe:</strong> {paciente.nomeMae}</p>
              <p><strong>Data de Nascimento:</strong> {paciente.dataNasc && new Date(paciente.dataNasc).toLocaleDateString()}</p>
              <p><strong>Sexo:</strong> {paciente.sexo}</p>
              <p><strong>Documento:</strong> {paciente.documento}</p>
              <p><strong>Plano de Saúde:</strong> {paciente.plano}</p>
              <p><strong>Alergias:</strong> {paciente.alergias}</p>
              <p><strong>Vacinas:</strong> {paciente.vacinas}</p>
              <p><strong>Histórico Familiar:</strong> {paciente.historicoFamilia}</p>
              <p><strong>Internações:</strong> {paciente.internacoes}</p>
              <p><strong>Comorbidades/Condições Pré-Existentes:</strong>{" "}{paciente.comorbidade}</p>
              <em className="espaco"></em>
              {!isAssistente ? (
                <p>
                  <strong>Histórico do Paciente/Prontuário:</strong> <br />
                  <br /> {paciente.prontuario}
              </p>
              ) : (
                <p>
                  <strong>Histórico do Paciente/Prontuário:</strong> <br />
                  <br /> <span className="acessoNegado"><b>Restrição de Acesso!</b><i>Para proteger a privacidade do paciente, o acesso ao prontuário é restrito ao médico responsável.</i></span>
              </p>
              )}
            </div>
          </div>
      <span className="boxExames">
        <em className="topoExame">
          <h2>Exames</h2>
          <button className="btn btn-exame" onClick={() => setShowExameModal(true)}> Adicionar Novo Exame </button>
        </em>
          {paciente.exame && paciente.exame.length > 0 ? (
            <table id="lista">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Resultado</th>
                  <th>Observações</th>
                  <th id="campo-anex">Anexo</th>
                  <th id="campo-delet"></th>
                </tr>
              </thead>
              <tbody>
                {paciente.exame.map((exame) => (
                  <tr key={exame._id}>
                    <td>{exame.tipo}</td>
                    <td>{exame.resultado}</td>
                    <td>{exame.observacoes}</td>
                    <td>
                      {exame.anexo}
                      <button
                        onClick={() => handleViewExame(exame._id)}
                        className="botao"
                      >
                        <span
                          id="abrir-exame"
                          alt="Abrir exame"
                          title="Abrir Exame"
                        >
                          Ver Exame
                        </span>
                      </button>
                      <button
                        onClick={() => handleDownloadExame(exame._id)}
                        className="botao"
                      >
                        <span
                          id="download"
                          alt="Fazer Download"
                          title="Fazer Download"
                        >
                          Fazer Download
                        </span>
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => confirmDeleteExame(exame._id)}
                        className="botao"
                      >
                        <span
                          id="excluir-exame"
                          alt="Excluir Exame"
                          title="Excluir Exame"
                        ></span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhum exame encontrado.</p>
          )}
          </span>
        </>
      )}

      {showUpdateModal && (
        <div className="modal">
          <div className="modal-paciente">
            <span
              className="btn-fechar"
              onClick={() => setShowUpdateModal(false)}
            >
              &times;
            </span>
            <h2>Atualizar Dados do Paciente</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="form100">
                <label>Nome:</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />
                {errors.nome && <p className="error">{errors.nome}</p>}
              </div>
               <div className="form23">
                <label>Telefone:</label>
                <input
                  type="text"
                  name="fone"
                  value={formData.fone}
                  onChange={handleChange}
                />
                {errors.fone && <p className="error">{errors.fone}</p>}
              </div>
               <div className="form60">
                <label>Endereço:</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                />
              </div>
              <div className="form48">
                <label>Medicamentos:</label>
                <input
                  type="text"
                  name="remedio"
                  value={formData.remedio}
                  onChange={handleChange}
                />
              </div>
              <div className="form48">
                <label>Nome da Mãe:</label>
                <input
                  type="text"
                  name="nomeMae"
                  value={formData.nomeMae}
                  onChange={handleChange}
                />
              </div>

              <div className="form30">
                <label>Data de Nascimento:</label>
                <input
                  type="date"
                  name="dataNasc"
                  value={formData.dataNasc ? formData.dataNasc : ""}
                  onChange={handleChange}
                />
                {errors.dataNasc && <p className="error">{errors.dataNasc}</p>}
              </div>

              <div className="form30">
                <label>Sexo:</label>
                <select name="sexo" value={formData.sexo} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
                {errors.sexo && <p className="error">{errors.sexo}</p>}
              </div>

              <div className="form30">
                <label>Documento:</label>
                <input
                  type="text"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                />
              </div>

              <div className="form30">
                <label>Plano de Saúde:</label>
                <input
                  type="text"
                  name="plano"
                  value={formData.plano}
                  onChange={handleChange}
                />
              </div>

              <div className="form30">
                <label>Alergias:</label>
                <input
                  type="text"
                  name="alergias"
                  value={formData.alergias}
                  onChange={handleChange}
                />
              </div>

              <div className="form30">
                <label>Vacinas:</label>
                <input
                  type="text"
                  name="vacinas"
                  value={formData.vacinas}
                  onChange={handleChange}
                />
              </div>

              <div className="form100">
                <label>Histórico Familiar:</label>
                <input
                  type="text"
                  name="historicoFamilia"
                  value={formData.historicoFamilia}
                  onChange={handleChange}
                />
              </div>

              <div className="form48">
                <label>Internações:</label>
                <input
                  type="text"
                  name="internacoes"
                  value={formData.internacoes}
                  onChange={handleChange}
                />
              </div>

              <div className="form48">
                <label>Comorbidades/Condições Pré-Existentes:</label>
                <input
                  type="text"
                  name="comorbidade"
                  value={formData.comorbidade}
                  onChange={handleChange}
                />
              </div>
            {!isAssistente ? (
                <div className="form100">
                  <label>Histórico do Paciente/Prontuário:</label>
                  <textarea
                    type="text"
                    name="prontuario"
                    value={formData.prontuario}
                    onChange={handleChange}
                  />
                </div>
                ) : (
                  <span className="acessoBloq">
                    <b>Histórico do Paciente/Prontuário:</b>
                    <i>Somente o médico pode acessar ou alterar o histórico do paciente</i>
                  </span>
            )}
              <button type="submit" className="btn">
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}

      {showExameModal && (
        <div className="modal">
          <div className="modal-paciente">
            <span
              className="btn-fechar"
              onClick={() => setShowExameModal(false)}
            >
              &times;
            </span>
            <h2>Adicionar Novo Exame</h2>
            <form onSubmit={handleExameSubmit}>
              <div className="form23">
                <label>Tipo:</label>
                <input
                  type="text"
                  name="tipo"
                  value={exameData.tipo}
                  onChange={handleExameChange}
                />
                {errors.tipo && <p className="error">{errors.tipo}</p>}
              </div>
              <div className="form60">
                <label>Anexo:</label>
                <input type="file" name="anexo" onChange={handleExameChange} />
                {errors.anexo && <p className="error">{errors.anexo}</p>}
              </div>
              <div className="form100">
                <label>Resultado:</label>
                <input
                  type="text"
                  name="resultado"
                  value={exameData.resultado}
                  onChange={handleExameChange}
                />
              </div>
              <div className="form100">
                <label>Observações:</label>
                <textarea
                  name="observacoes"
                  value={exameData.observacoes}
                  onChange={handleExameChange}
                />
              </div>
              <button type="submit" className="btn">
                Adicionar Exame
              </button>
            </form>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="modal">
          <div className="modal-content modal-deletar">
            <h3>Deletar Paciente</h3>
            <h4 className="msg-deletar">
              Tem certeza que deseja deletar os dados do paciente? <br />
              Não será possível recuperar depois de confirmar.
            </h4>
            <span className="botoesDeletar">
            <button onClick={handleDeletePaciente} className="btn btn-dark">
              Sim, Deletar
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="btn"
            >
              Cancelar
            </button>
            </span>
          </div>
        </div>
      )}
      {showDeleteExameConfirm && (
        <div className="modal">
          <div className="modal-content modal-deletar">
             <h3>Deletar Exame</h3>
            <h4 className="msg-deletar">
              Tem certeza que deseja deletar este exame?<br />
              Não será possível recuperar depois de confirmar.
            </h4>
            <span className="botoesDeletar">
            <button onClick={handleDeleteExame} className="btn btn-dark">
              Sim, Deletar
            </button>
            <button
              onClick={() => setShowDeleteExameConfirm(false)}
              className="btn"
            >
              Cancelar
            </button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PacienteDetalhes;
