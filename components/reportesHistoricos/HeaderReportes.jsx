import React from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import * as etiquetas from "../../utils/publicador/etiquetas";
import boleta from "../../img/boleta.svg";
import "../../css/publicador.scss";

function HeaderReportes() {
  const modulo = useSelector((store) => store.menu.moduloSeleccionado);
  return (
    <div className="div_publ_title">
      <img src={boleta} style={{ width: "45px" }} />
      <span>{"  " + modulo.nombreModulo}</span>
    </div>
  );
}
export default HeaderReportes;
