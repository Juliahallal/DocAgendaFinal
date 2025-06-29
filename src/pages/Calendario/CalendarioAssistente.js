import React from "react";
import { useParams } from "react-router-dom";
import Calendar from "../../components/Calendar";

const CalendarioAssistente = () => {
  const { medicoId } = useParams();

  return (
    <div className="calendario">
      <Calendar isAssistente={true} userId={medicoId} />
    </div>
  );
};

export default CalendarioAssistente;
