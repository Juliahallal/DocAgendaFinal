import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, profile } from "../../slices/userSlice";
import "./PerfilMedico.css";

const PerfilMedico = () => {
  const dispatch = useDispatch();
  const { user, error, message } = useSelector((state) => state.user);
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [formError, setFormError] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");


  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setNome(user.name || "");
    }
  }, [user]);


  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validações
    if (senha && senha.length < 5) {
      setFormError("A senha deve ter pelo menos 5 caracteres.");
      return;
    }
  
    if (senha && senha !== confirmSenha) {
      setFormError("As senhas não coincidem.");
      return;
    }
  
    const data = { name: nome };
    if (senha) data.password = senha;
  
    setFormError("");
    dispatch(updateProfile(data));
  };
  
  

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch({ type: "user/resetMessage" });
      }, 3000);
      return () => clearTimeout(timer); 
    }
  }, [message, error, dispatch]);

  useEffect(() => {
    return () => {
      dispatch({ type: "user/resetMessage" });
    };
  }, [dispatch]);
    

  return (
    <div className="perfil-medico-container">
      <h2>Meu Perfil</h2>
      <p className="cinza">Altere informações sobre o seu cadastro e acesso na plataforma.</p>
      {message && <p className="msg success">{message}</p>}
      {error && <p className="msg error">{error}</p>}
      <form onSubmit={handleSubmit} className="perfil-form">
        <label>
         <span> Nome:</span>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </label>

        <label>
          <span> Nova Senha:</span> 
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua nova senha"
          />
        </label>

        <label>
         <span> Confirmar Nova Senha:</span> 
          <input
            type="password"
            value={confirmSenha}
            onChange={(e) => setConfirmSenha(e.target.value)}
            placeholder="Repita a nova senha"
          />
        </label>
        {formError && <p className="msg error">{formError}</p>}

        <button type="submit" className="btn">
          Atualizar Dados
        </button>
      </form>
    </div>
  );
};

export default PerfilMedico;
