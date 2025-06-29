import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Assistentes.css";
import {
  getAssistentes,
  removerAssistente,
} from "../../slices/userSlice";
import { resetMessage } from "../../slices/userSlice";

import {
  adicionaAssitenteAoMedico,
  fetchNotifications,
  updateHelpStatus,
  deleteNotification
} from "../../services/notificationService";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const Assistentes = () => {
  const dispatch = useDispatch();

  const { assistentes, loading, error, message } = useSelector(
    (state) => state.user
  );
  const auth = useSelector((state) => state.auth.user);
  const userData = auth;
  

  useEffect(() => {
    dispatch(getAssistentes());
  }, [dispatch]);

  const handleRemoverAcesso = (assistenteId) => {
    dispatch(removerAssistente(assistenteId)).then(() => {
      dispatch(getAssistentes()); // Atualiza a lista após remover
    });
  };

  const meusAssistentes = assistentes?.filter((assistente) =>
    assistente.medicoIds?.some((id) => id === auth._id)
  );

  const outrosAssistentes = assistentes?.filter(
    (assistente) => !assistente.medicoIds?.some((id) => id === auth._id)
  );

    const [notifications, setNotifications] = useState([]);
 
  
    useEffect(() => {
      const loadNotifications = async () => {
        const data = await fetchNotifications();
        console.log(data);
        setNotifications(data);
      };
  
      loadNotifications();
    }, []);
  
    const notificacaoAceitar = () => toast("Acesso Liberado");
    const notificacaoNegar = () => toast("Acesso negado");
  
    
  
    const handleAccept = async (notificationId, assistenteId) => {
      try {
        await adicionaAssitenteAoMedico(userData._id, assistenteId);
        await updateHelpStatus(notificationId, "accepted");
        console.log("Acesso Liberado");
        notificacaoAceitar();
        // Remover a notificação aceita do estado
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification._id !== notificationId
          )
        );
        await deleteNotification(notificationId);
      } catch (error) {
        console.error("Erro ao liberar o acesso:", error);
      }
    };
  
    const handleReject = async (notificationId) => {
      try {
        await updateHelpStatus(notificationId, "rejected");
        console.log("Acesso Negado");
        notificacaoNegar();
        // Remover a notificação negada do estado
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification._id !== notificationId
          )
        );
        await deleteNotification(notificationId);
      } catch (error) {
        console.error("Erro ao negar acessso:", error);
      }
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
        dispatch(resetMessage());
      };
    }, [dispatch]);
    

  return (
    <div className="listaAssistentes">

      {notifications?.length > 0 && (
        <div className="notificacoes">
          <h2 className="tituloSolicitacao">Solicitações Pendentes</h2>
          {notifications.map((notification) => (
            <div key={notification._id} className="notification-item">
              <p>{notification.message}</p>
              <div className="notification-buttons">
                <button
                  className="accept-button"
                  onClick={() =>
                    handleAccept(notification._id, notification.senderId)
                  }
                >
                  Aceitar
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleReject(notification._id)}
                >
                  Negar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="tituloSolicitacao">Meus Assistentes</h2>
      {loading && <p>Carregando assistentes...</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <ul className="boxAssistentes">
        {meusAssistentes && meusAssistentes.length > 0 ? (
          meusAssistentes.map((assistente) => (
            <li key={assistente._id}>
              <strong>{assistente.name}</strong>  {assistente.email}
              <button
                onClick={() => handleRemoverAcesso(assistente._id)}
                className="remover-btn"
              >
                Remover Acesso
              </button>
            </li>
          ))
        ) : (
          !loading && <li>Você ainda não tem assistentes vinculados.</li>
        )}
      </ul>

    </div>
  );
};

export default Assistentes;
