import { useEffect, useState } from "react";
import { Col, Select, Form } from "antd";
import * as etiquetas from "../../utils/publicador/etiquetas";

function TipoReporte({
  idDetalle,
  idEstado,
  idDistrito,
  seleccionarTipoReporte,
  formRef,
}) {
  const [optionsTipoReporte, setOptionsTipoReporte] = useState([
    { value: 0, label: etiquetas.FOLDER_LISTADOS },
    { value: 1, label: etiquetas.FOLDER_CEDULAS },
  ]);

  useEffect(() => {
    if (formRef?.current) {
      formRef.current.resetFields(["comboTipoReporte"]);
    }
  }, [idDetalle, idEstado, idDistrito]);

  const onChangeTipoReporte = (value) => {
    let tipoReporte = etiquetas.FOLDER_LISTADOS;
    if (value && value === 1) {
      tipoReporte = etiquetas.FOLDER_CEDULAS;
    }
    seleccionarTipoReporte(tipoReporte);
  };

  return (
    <Col xs={24} md={8} xl={6} className="geografico">
      <div>
        <span className="span-info-gen">{etiquetas.ETQ_TIPO_REPORTE}</span>
      </div>
      <div>
        <Form.Item name="comboTipoReporte">
          <Select
            name="comboTipoReporte"
            placeholder={etiquetas.SELECCIONA}
            disabled={!idDetalle}
            options={optionsTipoReporte}
            onSelect={onChangeTipoReporte}
          ></Select>
        </Form.Item>
      </div>
    </Col>
  );
}
export default TipoReporte;
