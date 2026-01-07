import { useEffect, useState, useRef } from "react";
import { Row, Col, Select, Form } from "antd";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { apiClientPost } from "../../utils/apiClient";
import * as etiquetas from "../../utils/header/etiquetas";
import { SELECCIONA } from "../../utils/publicador/etiquetas";
import * as constantes from "../../utils/constantes";

function FiltrosGeografico({
  seleccionarEstado,
  seleccionarProceso,
  seleccionarDistrito,
  formRef,
  onChangeLoading,
  onchangeEstadoHistoricos,
}) {
  const isFirstRender = useRef(true);
  const user = useSelector((store) => store.loginUser.currentUser);
  const [idEstado, setIdEstado] = useState(user?.idEstado);
  const [idDistrito, setIdDistrito] = useState(user?.idDistrito);

  const [mapEstados, setMapEstados] = useState([]);
  const [mapDetalles, setMapDetalles] = useState([]);
  const [mapDistritos, setMapDistritos] = useState([]);

  const [optionsDetalles, setOptionsDetalles] = useState([]);
  const [optionsEstados, setOptionsEstados] = useState([]);
  const [optionsDistritos, setOptionsDistritos] = useState([]);
  const [mensajeHistoricos, setMensajeHistoricos] = useState("");

  useEffect(() => {
    iniciaCarga();
  }, []);

  const iniciaCarga = () => {
    onChangeLoading(false);
    let request = {
      idEstado: idEstado,
      idDistrito: idDistrito,
    };
    apiClientPost("obtieneEstadoDetalleHistoricos", request)
      .then((data) => {
        let code = data.code;
        if (code === constantes.CODE_SUCCESS) {
          const result = data.data;
          setMapEstados(data.data);
          if (result === undefined || Object.keys(result).length === 0) {
            setMensajeHistoricos("No se encontraron datos historicos.");
            onchangeEstadoHistoricos(false);
          } else {
            onchangeEstadoHistoricos(true);
            llenarOptionsEstados(result);
            validarEstadoUnico(result);
            if (idEstado > 0) {
              llenarMapDetalles(result, idEstado);
            }
          }
        } else {
          setMensajeHistoricos("No se encontraron datos historicos.");
          onchangeEstadoHistoricos(false);
        }
        onChangeLoading(false);
      })
      .catch((error) => {
        console.log(error);
        onChangeLoading(false);
      });
  };

  const llenarOptionsEstados = (estados) => {
    let options = [];
    if (estados != undefined && Object.keys(estados).length > 0) {
      Object.keys(estados).forEach((key) => {
        const edo = estados[key];
        options.push({
          value: edo.idEstado,
          label: edo.nombreEstado,
        });
      });
    }
    setOptionsEstados(options);
  };

  const validarEstadoUnico = (estados) => {
    if (estados != undefined && Object.keys(estados).length === 1) {
      let estado = estados[Object.keys(estados)];
      seleccionarEstado(estado.idEstado, estado.nombreEstado);
    }
  };

  const llenarMapDetalles = (estados, estado) => {
    const result = Object.keys(estados)
      .filter((key) => estados[key].idEstado === estado)
      .map((key) => estados[key].detalles);
    let detalles = result != undefined ? result[0] : {};
    setMapDetalles(detalles);
    llenarOptionsDetalles(detalles);
    validarProcesoUnico(detalles);
  };

  const llenarOptionsDetalles = (detalles) => {
    let options = [];
    if (detalles != undefined && Object.keys(detalles).length > 0) {
      Object.keys(detalles).forEach((key) => {
        const det = detalles[key];
        options.push({
          value: det.idDetalle,
          label: det.nombreDetalle,
        });
      });
    }
    setOptionsDetalles(options);
  };

  const validarProcesoUnico = (detalles) => {
    if (detalles != undefined && Object.keys(detalles).length === 1) {
      let detalle = detalles[Object.keys(detalles)];
      seleccionarProceso(detalle);
      //setIdDetalle(detalle.idDetalle);
      setMapDistritos(detalle.participaciones);
      llenarOptionsDistritos(detalle.participaciones);
      validarDistritoUnico(detalle.participaciones);
    }
  };

  const llenarOptionsDistritos = (participaciones) => {
    let options = [];
    if (idEstado != undefined && idEstado > 0 && user?.idDistrito === 0) {
      options.push({
        value: 0,
        label: etiquetas.MENU_FILTROS_DISTRITO_LABEL_0,
      });
    }
    if (
      participaciones != undefined &&
      Object.keys(participaciones).length > 0
    ) {
      Object.keys(participaciones).forEach((key) => {
        const dto = participaciones[key];
        const nombreDto =
          dto.idDistrito === 0
            ? `${dto.nombreDistrito}`
            : `${dto.idDistrito}-${dto.nombreDistrito}`;
        options.push({
          value: dto.idDistrito,
          label: nombreDto,
        });
      });
    }
    setOptionsDistritos(options);
  };

  const validarDistritoUnico = (participaciones) => {
    if (
      participaciones != undefined &&
      Object.keys(participaciones).length === 1
    ) {
      let distrito = participaciones[Object.keys(participaciones)];
      setIdDistrito(distrito.idDistrito);
      seleccionarDistrito(distrito.idDistrito, distrito.nombreDistrito);
    }
  };

  useEffect(() => {
    if (
      idEstado != undefined &&
      mapEstados &&
      Object.keys(mapEstados).length > 0
    ) {
      llenarMapDetalles(mapEstados, idEstado);
    }
    if (user?.idDistrito == 0) {
      setIdDistrito(0);
    }
  }, [idEstado]);

  const onChangeEstado = (value) => {
    const estado = parseInt(value);
    setIdEstado(estado);
    if (formRef?.current) {
      formRef.current.resetFields(["comboProceso"]);
      formRef.current.resetFields(["comboDistrito"]);
    }
    if (estado === idEstado) {
      llenarMapDetalles(mapEstados, estado);
    }
    setOptionsDistritos([]);
    if (mapEstados && Object.keys(mapEstados).length > 0) {
      let result = Object.keys(mapEstados)
        .filter((key) => mapEstados[key].idEstado === estado)
        .map((key) => mapEstados[key]);
      let objEstado = result != undefined ? result[0] : {};
      seleccionarEstado(objEstado.idEstado, objEstado.nombreEstado);
    } else {
      seleccionarEstado(estado, "");
    }
  };

  const onChangeProceso = (value) => {
    if (formRef?.current) {
      formRef.current.resetFields(["comboDistrito"]);
    }
    let detalleId = value != undefined ? parseInt(value) : 0;

    if (mapDetalles != undefined && Object.keys(mapDetalles).length > 0) {
      let result = Object.keys(mapDetalles)
        .filter((key) => mapDetalles[key].idDetalle === detalleId)
        .map((key) => mapDetalles[key]);
      let detalle = result != undefined ? result[0] : {};
      seleccionarProceso(detalle);
      setMapDistritos(detalle.participaciones);
      if (detalleId != undefined) {
        llenarOptionsDistritos(detalle.participaciones);
      }
    }
  };

  const onChangeDistrito = (value) => {
    let distritoId = value != undefined ? parseInt(value) : 0;
    setIdDistrito(distritoId);
    if (distritoId > 0) {
      if (mapDistritos != undefined && Object.keys(mapDistritos).length > 0) {
        let result = Object.keys(mapDistritos)
          .filter((key) => mapDistritos[key].idDistrito === distritoId)
          .map((key) => mapDistritos[key]);
        let distrito = result != undefined ? result[0] : {};
        seleccionarDistrito(distrito.idDistrito, distrito.nombreDistrito);
      }
    } else {
      seleccionarDistrito(distritoId, "");
    }
  };

  return mensajeHistoricos != "" ? (
    <div className="publicador-reporte-container">
      <div className="rc-error">
        <span className="rc-error-msg">
          {mensajeHistoricos ? mensajeHistoricos : ""}
        </span>
      </div>
    </div>
  ) : (
    <Row id="geografico">
      <Col xs={24} md={8} xl={6} className="geografico">
        <div>
          <span className="span-info-gen">
            {etiquetas.MENU_FILTROS_ESTADO + ":"}
          </span>
        </div>
        <div>
          <Form.Item name="comboEstado">
            <Select
              value={
                optionsEstados.length === 1
                  ? optionsEstados[0].value
                  : undefined
              }
              name={"comboEstado"}
              placeholder={SELECCIONA}
              options={optionsEstados}
              disabled={optionsEstados.length < 2}
              onChange={onChangeEstado}
            ></Select>
            <input type="hidden"></input>
          </Form.Item>
        </div>
      </Col>
      <Col xs={24} md={0} xl={2} />
      <Col xs={24} md={8} xl={6} className="geografico">
        <div>
          <span className="span-info-gen">
            {etiquetas.MENU_FILTROS_PROCESO_ELECTORAL}
          </span>
        </div>
        <div>
          <Form.Item name="comboProceso">
            <Select
              value={
                optionsDetalles.length === 1
                  ? optionsDetalles[0].value
                  : undefined
              }
              name="comboProceso"
              placeholder={SELECCIONA}
              disabled={optionsDetalles.length < 2}
              options={optionsDetalles}
              onChange={onChangeProceso}
            ></Select>
            <input type="hidden"></input>
          </Form.Item>
        </div>
      </Col>
      <Col xs={24} md={0} xl={2} />
      <Col xs={24} md={8} xl={6} className="geografico">
        <div>
          <span className="span-info-gen">
            {etiquetas.MENU_FILTROS_DISTRITO}
          </span>
        </div>
        <div>
          <Form.Item name="comboDistrito">
            <Select
              value={
                optionsDistritos.length === 1
                  ? optionsDistritos[0].value
                  : optionsDistritos.length > 0
                  ? idDistrito
                  : undefined
              }
              name={"comboDistrito"}
              placeholder={SELECCIONA}
              onChange={onChangeDistrito}
              disabled={optionsDistritos.length < 2}
              options={optionsDistritos}
            ></Select>
            <input type="hidden"></input>
          </Form.Item>
        </div>
      </Col>
    </Row>
  );
}
export default FiltrosGeografico;
