import { Row, Col } from "antd";
import * as etiquetas from "../../utils/publicador/etiquetas";

function CorteReportes({ corte }) {
  return (
    <Row id="tipoReporte" className="phc-text">
      <Col xs={24} md={24} xl={24} className="geografico">
        {corte ? (
          <div className="phc-text-corte">
            <span className="phc-text-corte-label">
              {etiquetas.ULTIMO_CORTE}
            </span>
            <span className="phc-text-corte-value">{corte.fecha}</span>
          </div>
        ) : (
          ""
        )}
      </Col>
    </Row>
  );
}
export default CorteReportes;
