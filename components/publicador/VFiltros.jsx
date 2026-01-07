import { React, useState } from "react";
import { Row, Select, Col } from "antd";
import { useSelector } from "react-redux/es/hooks/useSelector";
import * as etiquetas from "../../utils/publicador/etiquetas";
import { ID_MODULO_HISTORICOS } from "../../utils/constantes";

const { Option } = Select;
const VFiltros = ({
  tipoReporte,
  listaReportes,
  reporteSeleccionado,
  nivelSeleccionado,
  seleccionaReporte,
  seleccionaNivelReporte,
}) => {
  const moduloSeleccionado = useSelector(
    (store) => store.menu.moduloSeleccionado
  );
  const [idModulo, setIdModulo] = useState(moduloSeleccionado.idModulo);
  const obtenerNiveles = () => {
    let options = [];
    if (
      listaReportes &&
      listaReportes[reporteSeleccionado] &&
      listaReportes[reporteSeleccionado].niveles
    ) {
      if (
        idModulo === ID_MODULO_HISTORICOS &&
        tipoReporte === etiquetas.FOLDER_CEDULAS
      ) {
        options = Object.values(listaReportes[reporteSeleccionado].niveles)
          .sort((a, b) => b.idModulo - a.idModulo)
          .map((nivel) => (
            <Option key={nivel.key} value={nivel.key}>
              {nivel.label}
            </Option>
          ));
      } else {
        options = Object.values(listaReportes[reporteSeleccionado].niveles).map(
          (nivel) => (
            <Option key={nivel.key} value={nivel.key}>
              {nivel.label}
            </Option>
          )
        );
      }
    }
    return options;
  };
  return (
    <div className="publicador-filtros-container">
      <Row style={{ width: "100%" }}>
        <Col
          xs={24}
          md={idModulo === ID_MODULO_HISTORICOS ? 12 : 10}
          xl={idModulo === ID_MODULO_HISTORICOS ? 10 : 8}
          className="geografico"
        >
          <div className="div_selecc_tipoRepo">
            <span>
              {tipoReporte === etiquetas.FOLDER_LISTADOS
                ? etiquetas.EL_LISTADO
                : tipoReporte === etiquetas.FOLDER_CEDULAS
                ? etiquetas.LA_CEDULA
                : etiquetas.SELECCIONA}
            </span>
          </div>
          <Select
            showArrow={true}
            placeholder={etiquetas.SELECCIONA}
            value={reporteSeleccionado}
            onSelect={seleccionaReporte}
            disabled={!listaReportes || listaReportes.length === 0}
          >
            {listaReportes &&
              Object.values(listaReportes).map((reporte) => (
                <Option key={reporte.key} value={reporte.key}>
                  {reporte.label}
                </Option>
              ))}
          </Select>
        </Col>
        <Col xs={24} md={0} xl={2} style={{ marginRight: "5px" }} />
        {tipoReporte === etiquetas.FOLDER_CEDULAS && reporteSeleccionado ? (
          <Col
            xs={24}
            md={idModulo === ID_MODULO_HISTORICOS ? 12 : 10}
            xl={idModulo === ID_MODULO_HISTORICOS ? 8 : 6}
            className="geografico"
          >
            <div className="div_selecc_niveles">
              <span>{etiquetas.NIVEL}</span>
            </div>
            <Select
              showArrow={true}
              placeholder={etiquetas.SELECCIONE_NIVEL}
              value={nivelSeleccionado}
              onSelect={seleccionaNivelReporte}
            >
              {listaReportes &&
                listaReportes[reporteSeleccionado] &&
                listaReportes[reporteSeleccionado].niveles &&
                obtenerNiveles()}
            </Select>
          </Col>
        ) : null}
      </Row>
    </div>
  );
};
export default VFiltros;
