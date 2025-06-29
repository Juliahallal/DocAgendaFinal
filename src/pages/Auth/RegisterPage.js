import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, registerAssistente, reset } from "../../slices/authSlice";
import { Link } from "react-router-dom";
import Message from "../../components/Message";
import "./Auth.css";

const RegisterPage = () => {
  const [tipo, setTipo] = useState("medico");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { name, email, password, confirmPassword };
    tipo === "medico"
      ? dispatch(register(user))
      : dispatch(registerAssistente(user));
  };

  return (
    <div id="login">
      <h2>Cadastro de {tipo === "medico" ? "Médico" : "Assistente"}</h2>
      <p className="cinza">Escolha o tipo de conta e preencha os campos:</p>

      <div className="toggle-buttons">
        <button onClick={() => setTipo("medico")} className={tipo === "medico" ? "active" : ""}>
          Médico
        </button>
        <button onClick={() => setTipo("assistente")} className={tipo === "assistente" ? "active" : ""}>
          Assistente
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          <span>Nome</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          <span>E-mail</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <span>Senha</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          <span>Confirme sua senha</span>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </label>

        {!loading && <input className="btn" type="submit" value="Cadastrar" />}
        {loading && <input type="submit" className="btn" disabled value="Aguarde..." />}
        {error && <Message msg={error} type="error" />}
      </form>

      <p className="cinza">
        Já tem conta? <Link to="/login">Clique aqui</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
