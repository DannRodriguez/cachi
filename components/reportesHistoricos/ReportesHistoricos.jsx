import { useEffect, useState, useRef } from "react";
import { Form, Row, Col } from "antd";
import AuthenticatedComponent from "../AuthenticatedComponent";
import Template from "../interfaz/Template";
import VReporte from "../publicador/VReporte.jsx";
import * as etiquetas from "../../utils/publicador/etiquetas";
import "../../css/publicador.scss";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Loader } from "../interfaz/Loader.jsx";
import Miga from "../commonComponents/Miga";
import HeaderReportes from "./HeaderReportes.jsx";
import { BarInfo } from "../commonComponents/AccessoriesComponents";
import FiltrosGeografico from "./FiltrosGeografico.jsx";
import TipoReporte from "./TipoReporte.jsx";
import CorteReportes from "./CorteReportes.jsx";
import VFiltros from "../publicador/VFiltros";
import {
  obtieneCatalogosReporte,
  obtieneDatosTabla,
  consultaRestringida,
  filtrarDatos,
} from "../../utils/publicador/funciones";

function ReportesHistoricos() {
  const [loading, setLoading] = useState(false);
  let formRef = useRef();
  const isMounted = useRef(true);
  const user = useSelector((store) => store.loginUser.currentUser);

  const [estado, setEstado] = useState(undefined);
  const [distrito, setDistrito] = useState(undefined);
  const [proceso, setProceso] = useState(undefined);
  const [existeHistorico, setExisteHistorico] = useState(false);
  const [tipoReporte, setTipoReporte] = useState("");

  const [listaReportes, setListaReportes] = useState([]);
  const [corte, setCorte] = useState("");
  const [reporteSeleccionado, setReporteSeleccionado] = useState(undefined);
  const [nivelSeleccionado, setNivelSeleccionado] = useState(undefined);

  const [datosTabla, setDatosTabla] = useState(undefined);
  const [nivel, setNivel] = useState();
  const [mensajes, setMensajes] = useState("");
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [isOpenCotas, setIsOpenCotas] = useState(false);

  const [municipioActual, setMunicipioActual] = useState({
    idMunicipio: 0,
    nombreMunicipio: "",
  });

  useEffect(() => {});

  const seleccionarEstado = (idEstado, nombreEdo) => {
    setEstado({ idEstado: idEstado, nombreEstado: nombreEdo });
    setDistrito({ idDistrito: 0, nombreDistrito: "JUNTA LOCAL" });
    setProceso(undefined);
    setTipoReporte("");
    setReporteSeleccionado(undefined);
    setNivelSeleccionado(undefined);
  };

  const seleccionarProceso = (datosProceso) => {
    let proceso = {
      idProcesoElectoral: datosProceso.idProceso,
      nombreProceso: datosProceso.nombreProceso,
      idDetalleProceso: datosProceso.idDetalle,
      descripcionDetalle: datosProceso.nombreDetalle,
    };
    setProceso(proceso);
    setDistrito({ idDistrito: 0, nombreDistrito: "JUNTA LOCAL" });
    setTipoReporte("");
    setReporteSeleccionado(undefined);
    setNivelSeleccionado(undefined);
  };

  const seleccionarDistrito = (idDistrito, nombreDistrito) => {
    setDistrito({ idDistrito: idDistrito, nombreDistrito: nombreDistrito });
    setTipoReporte("");
    setReporteSeleccionado(undefined);
    setNivelSeleccionado(undefined);
  };

  const onChangeLoading = (loader) => {
    setLoading(loader);
  };

  const onChangeTipoReporte = (tipoReporte) => {
    setTipoReporte(tipoReporte);
    setReporteSeleccionado(undefined);
    setNivelSeleccionado(undefined);
  };

  useEffect(() => {
    if (tipoReporte && tipoReporte.trim() != "") {
      consultarCatalogosReporte();
      setDatosTabla(undefined);
      setDatosFiltrados(undefined);
      setMensajes("");
    } else {
      setListaReportes([]);
      setCorte("");
      setDatosTabla(undefined);
      setDatosFiltrados(undefined);
      setMensajes("");
    }
  }, [tipoReporte]);

  const consultarCatalogosReporte = async () => {
    const catalogosReportes = await obtieneCatalogosReporte(
      proceso.idProcesoElectoral,
      tipoReporte
    );
    if (catalogosReportes) {
      setListaReportes(catalogosReportes?.listaReportes);
      setCorte(catalogosReportes?.corte);
    }
  };

  const seleccionarReporte = (reporte) => {
    setDatosTabla(undefined);
    setDatosFiltrados(undefined);
    setMensajes("");
    setReporteSeleccionado(reporte);
    setNivelSeleccionado(undefined);
    obtenerDatosTabla(reporte, undefined);
  };

  const seleccionarNivelReporte = (nivel) => {
    setNivelSeleccionado(nivel);
    obtenerDatosTabla(reporteSeleccionado, nivel);
  };

  const obtenerDatosTabla = async (reporte, nivel) => {
    if (!proceso) {
      setMensajes(etiquetas.SELECCIONA_PROCESO);
      return;
    }
    if (!reporte || (!nivel && tipoReporte === etiquetas.FOLDER_CEDULAS)) {
      return;
    }
    setLoading(true);
    let nivelActual = nivel;
    let idDetalleActual = proceso?.idDetalleProceso;
    let idEstadoActual = estado?.idEstado;
    let idDistritoActual = distrito != undefined ? distrito.idDistrito : 0;
    let idMunicipioActual = 0;
    const datosTabla = await obtieneDatosTabla(
      proceso?.idProcesoElectoral,
      idDetalleActual,
      tipoReporte,
      corte,
      reporte,
      nivelActual,
      idEstadoActual,
      idDistritoActual,
      idMunicipioActual,
      consultaRestringida(user.rolUsuario)
    );
    if (
      idEstadoActual > 0 &&
      tipoReporte === etiquetas.FOLDER_CEDULAS &&
      (nivelActual === etiquetas.NIVEL_DISTRITOS_SIN_TOTALES ||
        nivelActual === etiquetas.NIVEL_ENTIDAD ||
        nivelActual === etiquetas.NIVEL_DISTRITOS_TOTALES)
    ) {
      let data = filtrarDatos(
        tipoReporte,
        idEstadoActual,
        idDistritoActual,
        datosTabla
      );
      datosTabla.data["datos"] = data;
      setDatosTabla(datosTabla.data);
    } else {
      setDatosTabla(datosTabla?.data);
    }
    if (datosTabla.msg) {
      setMensajes(datosTabla.msg);
      setDatosTabla(undefined);
      setNivel(undefined);
    } else {
      setNivel(
        reporte && nivelActual && listaReportes[reporte].niveles[nivelActual]
          ? listaReportes[reporte].niveles[nivelActual]
          : { label: "", key: nivelActual }
      );
    }
    setTimeout(() => setLoading(false), 0);
  };

  const handleChangeTabla = (pagination, filters, sorter, extra) => {
    setDatosFiltrados(extra.currentDataSource);
  };

  const handleChangeCotas = () => {
    setIsOpenCotas((prevIsOpenCotas) => !prevIsOpenCotas);
  };

  return (
    <AuthenticatedComponent>
      <Template>
        <div className="publicador-container">
          <Loader blocking={loading} />
          <Form layout="vertical" ref={formRef} id="formReportesHistoricos">
            <div className="publicador-header-container">
              <Miga />
              <HeaderReportes />
              {datosTabla?.cotas?.html?.length > 0 ? (
                <>
                  <BarInfo text={etiquetas.ACCESIBILIDAD_COTAS} />
                  <br />
                </>
              ) : (
                <></>
              )}
              {tipoReporte === etiquetas.FOLDER_CEDULAS &&
              nivelSeleccionado === etiquetas.NIVEL_PROCESO &&
              estado.idEstado > 0 ? (
                <>
                  <BarInfo text={etiquetas.MSG_CONSENTRADO_NACIONAL} />
                  <br />
                </>
              ) : (
                <></>
              )}
              {corte ? <CorteReportes corte={corte} /> : ""}
              <br />
              <FiltrosGeografico
                seleccionarEstado={seleccionarEstado}
                seleccionarProceso={seleccionarProceso}
                seleccionarDistrito={seleccionarDistrito}
                onChangeLoading={onChangeLoading}
                formRef={formRef}
                onchangeEstadoHistoricos={(existeHistorico) => {
                  setExisteHistorico(existeHistorico);
                }}
              />
              <br />
              <Row id="tipoReporte">
                {existeHistorico ? (
                  <TipoReporte
                    idDetalle={proceso?.idDetalleProceso}
                    idEstado={estado?.idEstado}
                    idDistrito={distrito?.idDistrito}
                    seleccionarTipoReporte={onChangeTipoReporte}
                    formRef={formRef}
                  />
                ) : (
                  ""
                )}
                <Col xs={24} md={0} xl={2} />
                <Col xs={24} md={16} xl={16} className="geografico">
                  {existeHistorico ? (
                    <VFiltros
                      tipoReporte={tipoReporte}
                      listaReportes={listaReportes}
                      reporteSeleccionado={reporteSeleccionado}
                      nivelSeleccionado={nivelSeleccionado}
                      seleccionaReporte={seleccionarReporte}
                      seleccionaNivelReporte={seleccionarNivelReporte}
                    />
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
              <br />
            </div>
            <br />
            <div className="pc-module-data">
              {existeHistorico ? (
                <VReporte
                  tipoReporte={tipoReporte}
                  reporte={
                    reporteSeleccionado
                      ? listaReportes[reporteSeleccionado]
                      : ""
                  }
                  nivel={nivel}
                  proceso={proceso}
                  estado={estado}
                  distrito={distrito}
                  municipio={municipioActual}
                  error={mensajes}
                  datosTabla={datosTabla}
                  datosFiltrados={datosFiltrados}
                  isVistaTemporal={false}
                  handleChangeTabla={handleChangeTabla}
                  handleLinkToNivel={() => {}}
                  handleReturn={() => {}}
                  isOpenCotas={isOpenCotas}
                  handleChangeCotas={handleChangeCotas}
                />
              ) : (
                ""
              )}
            </div>
          </Form>
        </div>
      </Template>
    </AuthenticatedComponent>
  );
}

export default ReportesHistoricos;
