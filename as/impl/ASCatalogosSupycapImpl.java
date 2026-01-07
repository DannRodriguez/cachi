package mx.ine.sustseycae.as.impl;

import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import mx.ine.sustseycae.as.ASCatalogosSupycap;
import mx.ine.sustseycae.dto.db.DTOAspirantes;
import mx.ine.sustseycae.dto.db.DTOAspirantesId;
import mx.ine.sustseycae.dto.db.DTOCCausasVacante;
import mx.ine.sustseycae.dto.db.DTOCFechas;
import mx.ine.sustseycae.dto.db.DTOSustitucionesSupycap;
import mx.ine.sustseycae.models.requests.ModelRequestFechasSustituciones;
import mx.ine.sustseycae.models.responses.ModelGenericResponse;
import mx.ine.sustseycae.models.responses.ModelResponseCategoriaSustitutos;
import mx.ine.sustseycae.models.responses.ModelResponseDatosAspirante;
import mx.ine.sustseycae.models.responses.ModelResponseDatosSustitucion;
import mx.ine.sustseycae.models.responses.ModelResponseDatosSustituto;
import mx.ine.sustseycae.models.responses.ModelResponseFechasSustituciones;
import mx.ine.sustseycae.models.responses.ModelResponseInfoSustitucion;
import mx.ine.sustseycae.models.responses.ModelResponseListaSustitutos;
import mx.ine.sustseycae.models.responses.ModelResponseSustitutos;
import mx.ine.sustseycae.repositories.RepoJPAAspirantes;
import mx.ine.sustseycae.repositories.RepoJPACCausasVacante;
import mx.ine.sustseycae.repositories.RepoJPACFechas;
import mx.ine.sustseycae.repositories.RepoJPASustitucionesSupycap;
import mx.ine.sustseycae.util.CategoriasSustitutosCapa;
import mx.ine.sustseycae.util.CategoriasSustitutosSup;
import mx.ine.sustseycae.util.Constantes;

@Service("asCatalogosSupycap")
public class ASCatalogosSupycapImpl implements ASCatalogosSupycap {

    private Log log = LogFactory.getLog(ASCatalogosSupycapImpl.class);

    @Autowired
    private RepoJPACCausasVacante repoJPACCausasVacante;

    @Autowired
    private RepoJPAAspirantes repoJPAAspirantes;

    @Autowired
    private RepoJPASustitucionesSupycap repoJPASustitucionesSupycap;

    @Autowired
    private RepoJPACFechas repoJPACFechas;

    @Override
    public List<DTOCCausasVacante> obtenerListaCausasVacante() {
        try {
            return repoJPACCausasVacante.findAll(
                    Sort.by(Sort.Order.asc("id.tipoCausaVacante"),
                            Sort.Order.asc("id.idCausaVacante")));
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    @Override
    public ModelResponseFechasSustituciones obtenerFechasSustituciones(ModelRequestFechasSustituciones request) {
        ModelResponseFechasSustituciones response = new ModelResponseFechasSustituciones();
        response.setFechaInicioSustituciones(repoJPACFechas.obtenerFechaSustitucion(
                request.getIdProceso(),
                request.getIdDetalle(),
                Constantes.ID_FECHA_INICIO_SUSTITUCIONES));
        response.setFechaFinSustituciones(repoJPACFechas.obtenerFechaSustitucion(
                request.getIdProceso(),
                request.getIdDetalle(),
                Constantes.ID_FECHA_FIN_SUSTITUCIONES));
        return response;
    }

    @Override
    public ModelGenericResponse obtenerListaSustitutosSupervisores(Integer idDetalleProceso, Integer idParticipacion) {
        ModelGenericResponse response = new ModelGenericResponse();
        try {
            List<ModelResponseSustitutos> sustitutos = repoJPAAspirantes
                    .obtenerListaSustitutosSupervisores(idDetalleProceso, idParticipacion);

            DTOCFechas fechaInicioSusticiones = repoJPACFechas
                    .findById_IdFechaAndId_IdDetalleProcesoAndId_IdEstadoAndId_IdDistrito(
                            Constantes.ID_FECHA_INICIO_SUSTITUCIONES, idDetalleProceso, 0, 0);
            Date fechaInicio = Date
                    .from(fechaInicioSusticiones.getFecha().atStartOfDay(ZoneId.systemDefault()).toInstant());

            DTOCFechas fechaFinSusticiones = repoJPACFechas
                    .findById_IdFechaAndId_IdDetalleProcesoAndId_IdEstadoAndId_IdDistrito(
                            Constantes.ID_FECHA_FIN_SUSTITUCIONES, idDetalleProceso, 0, 0);
            Date fechaFin = Date.from(fechaFinSusticiones.getFecha().atStartOfDay(ZoneId.systemDefault()).toInstant());

            ModelResponseListaSustitutos data = colocarCategoriasSustitutosSE(sustitutos, idDetalleProceso,
                    idParticipacion);
            data.setFechaInicioRegistroSustituciones(fechaInicio);
            data.setFechaFinRegistroSustituciones(fechaFin);

            response.setCode(Constantes.RESPONSE_CODE_200);
            response.setMessage(Constantes.ESTATUS_EXITO);
            response.setData(data);
            return response;
        } catch (Exception e) {
            log.error("ERROR ASCatalogosSupycapImpl -obtenerListaSustitutosSupervisores: ", e);
            response.setStatus(Constantes.ESTATUS_ERROR);
            response.setCode(Constantes.RESPONSE_CODE_500);
            response.setMessage("Ocurrio un error al obtener lista de los sustitutos del supervisor.");
            return response;
        }
    }

    @Override
    public ModelGenericResponse obtenerListaSustitutosCapacitadores(Integer idDetalleProceso, Integer idParticipacion) {
        ModelGenericResponse response = new ModelGenericResponse();
        try {
            List<ModelResponseSustitutos> sustitutos = repoJPAAspirantes
                    .obtenerListaSustitutosCapacitadores(idDetalleProceso, idParticipacion);

            DTOCFechas fechaInicioSusticiones = repoJPACFechas
                    .findById_IdFechaAndId_IdDetalleProcesoAndId_IdEstadoAndId_IdDistrito(
                            Constantes.ID_FECHA_INICIO_SUSTITUCIONES, idDetalleProceso, 0, 0);
            Date fechaInicio = Date
                    .from(fechaInicioSusticiones.getFecha().atStartOfDay(ZoneId.systemDefault()).toInstant());

            DTOCFechas fechaFinSusticiones = repoJPACFechas
                    .findById_IdFechaAndId_IdDetalleProcesoAndId_IdEstadoAndId_IdDistrito(
                            Constantes.ID_FECHA_FIN_SUSTITUCIONES, idDetalleProceso, 0, 0);
            Date fechaFin = Date.from(fechaFinSusticiones.getFecha().atStartOfDay(ZoneId.systemDefault()).toInstant());

            ModelResponseListaSustitutos data = colocarCategoriasSustitutosCAE(sustitutos, idDetalleProceso,
                    idParticipacion);
            data.setFechaInicioRegistroSustituciones(fechaInicio);
            data.setFechaFinRegistroSustituciones(fechaFin);

            response.setCode(Constantes.RESPONSE_CODE_200);
            response.setMessage(Constantes.ESTATUS_EXITO);
            response.setData(data);
            return response;
        } catch (Exception e) {
            log.error("ERROR ASCatalogosSupycapImpl -obtenerListaSustitutosCapacitadores: ", e);
            response.setStatus(Constantes.ESTATUS_ERROR);
            response.setCode(Constantes.RESPONSE_CODE_500);
            response.setMessage("Ocurrio un error al obtener lista de los sustitutos del capacitador.");
            return response;
        }
    }

    @Override
    public ModelGenericResponse obtenerAspiranteSustituto(Integer idProcesoElectoral, Integer idDetalleProceso,
            Integer idParticipacion, Integer idAspirante) {
        ModelGenericResponse response = new ModelGenericResponse();
        try {
            ModelResponseDatosSustituto datosSustituto = new ModelResponseDatosSustituto();

            DTOAspirantesId id = new DTOAspirantesId(idProcesoElectoral, idDetalleProceso, idParticipacion,
                    idAspirante);
            Optional<DTOAspirantes> sustitutoOpcional = repoJPAAspirantes.findById(id);
            sustitutoOpcional.ifPresent(dto -> datosSustituto.setDtoAspirante(dto));

            List<ModelResponseDatosAspirante> datosAspirante = repoJPAAspirantes
                    .obtenerDatosAspirante(idProcesoElectoral, idDetalleProceso, idParticipacion, idAspirante);
            datosSustituto.setDatosAspirante(
                    datosAspirante != null && !datosAspirante.isEmpty() ? datosAspirante.get(0) : null);

            response.setCode(Constantes.RESPONSE_CODE_200);
            response.setMessage(Constantes.ESTATUS_EXITO);
            response.setData(datosSustituto);
            return response;
        } catch (Exception e) {
            log.error("ERROR ASCatalogosSupycapImpl -obtenerAspiranteSustituto: ", e);
            response.setStatus(Constantes.ESTATUS_ERROR);
            response.setCode(Constantes.RESPONSE_CODE_500);
            response.setMessage("Ocurrio un error al obtener los datos del aspirante sustituto.");
            return response;
        }
    }

    @Override
    public ModelResponseInfoSustitucion obtenerInformacionSustitucion(Integer idProcesoElectoral,
            Integer idDetalleProceso,
            Integer idParticipacion, Integer idAspiranteSustituido, Integer tipoCausaVacante, Integer idSustitucion) {
        try {
            ModelResponseInfoSustitucion response = new ModelResponseInfoSustitucion();
            DTOSustitucionesSupycap dtoSustitucion = new DTOSustitucionesSupycap();
            dtoSustitucion = repoJPASustitucionesSupycap
                    .findById_IdDetalleProcesoAndId_IdParticipacionAndId_IdSustitucionAndIdAspiranteSutituidoAndIdPuestoSustituido(
                            idDetalleProceso, idParticipacion, idSustitucion, idAspiranteSustituido, 1);
            if (dtoSustitucion == null) {
                dtoSustitucion = repoJPASustitucionesSupycap
                        .findById_IdDetalleProcesoAndId_IdParticipacionAndId_IdSustitucionAndIdAspiranteSutituidoAndIdPuestoSustituido(
                                idDetalleProceso, idParticipacion, idSustitucion, idAspiranteSustituido, 2);
            }

            ModelResponseDatosSustitucion modelResponse = new ModelResponseDatosSustitucion();
            modelResponse.setDtoSustituciones(dtoSustitucion);

            if (Constantes.ID_PUESTO_SE.equals(dtoSustitucion.getIdPuestoSustituido())) {
                DTOCCausasVacante dtoCCausa = repoJPACCausasVacante.findById_IdCausaVacanteAndIdTipoCausaVacante(
                        dtoSustitucion.getIdCausaVacante(), dtoSustitucion.getTipoCausaVacante());
                modelResponse.setDescripcionCausaVacante(dtoCCausa.getDescripcion());
                response.setDtoSustitucionSE(modelResponse);
                if (dtoSustitucion.getIdAspiranteSutituto() != null) {
                    List<ModelResponseDatosAspirante> dtoAspiranteSustituto = repoJPAAspirantes.obtenerDatosAspirante(
                            idProcesoElectoral, idDetalleProceso, idParticipacion,
                            dtoSustitucion.getIdAspiranteSutituto());

                    response.setDatosSustitutoSE(
                            dtoAspiranteSustituto.size() > 0 ? dtoAspiranteSustituto.get(0) : null);
                }
                // buscaremos si extiste el registro de la sustitucion de quien sustituyo al SE
                DTOSustitucionesSupycap dtoSustitucionCAE = repoJPASustitucionesSupycap
                        .findById_IdDetalleProcesoAndId_IdParticipacionAndIdAspiranteSutituidoAndIdRelacionSustituciones(
                                idDetalleProceso, idParticipacion, dtoSustitucion.getIdAspiranteSutituto(),
                                dtoSustitucion.getIdRelacionSustituciones());

                ModelResponseDatosSustitucion modelResponseCAE = new ModelResponseDatosSustitucion();
                modelResponseCAE.setDtoSustituciones(dtoSustitucionCAE);

                if (dtoSustitucionCAE != null) {
                    DTOCCausasVacante dtoCCausa2 = repoJPACCausasVacante.findById_IdCausaVacanteAndIdTipoCausaVacante(
                            dtoSustitucionCAE.getIdCausaVacante(), dtoSustitucionCAE.getTipoCausaVacante());
                    modelResponseCAE.setDescripcionCausaVacante(dtoCCausa2.getDescripcion());
                    response.setDtoSustitucionCAE(modelResponseCAE);
                    if (dtoSustitucionCAE.getIdAspiranteSutituto() != null) {
                        List<ModelResponseDatosAspirante> dtoAspiranteSustituto = repoJPAAspirantes
                                .obtenerDatosAspirante(
                                        idProcesoElectoral, idDetalleProceso, idParticipacion,
                                        dtoSustitucionCAE.getIdAspiranteSutituto());

                        response.setDatosSustitutoCAE(
                                dtoAspiranteSustituto.size() > 0 ? dtoAspiranteSustituto.get(0) : null);
                    }
                }

            } else if (Constantes.ID_PUESTO_CAE.equals(dtoSustitucion.getIdPuestoSustituido())) {
                DTOCCausasVacante dtoCCausa2 = repoJPACCausasVacante.findById_IdCausaVacanteAndIdTipoCausaVacante(
                        dtoSustitucion.getIdCausaVacante(), dtoSustitucion.getTipoCausaVacante());
                modelResponse.setDescripcionCausaVacante(dtoCCausa2.getDescripcion());
                response.setDtoSustitucionCAE(modelResponse);
                List<ModelResponseDatosAspirante> dtoAspiranteSustituto = repoJPAAspirantes.obtenerDatosAspirante(
                        idProcesoElectoral, idDetalleProceso, idParticipacion, dtoSustitucion.getIdAspiranteSutituto());

                response.setDatosSustitutoCAE(dtoAspiranteSustituto.size() > 0 ? dtoAspiranteSustituto.get(0) : null);

                List<DTOSustitucionesSupycap> sustitucionesRelacionadas = repoJPASustitucionesSupycap
                        .findById_IdDetalleProcesoAndId_IdParticipacionAndIdRelacionSustituciones(idDetalleProceso,
                                idParticipacion, dtoSustitucion.getIdRelacionSustituciones());
                if (sustitucionesRelacionadas.size() > 1) {// podria tratarse de la sustitución de un CAE en un flujo de
                    // sustitución de SE
                    for (DTOSustitucionesSupycap sustBD : sustitucionesRelacionadas) {
                        if (sustBD.getIdPuestoSustituido().equals(Constantes.ID_PUESTO_SE)
                                && sustBD.getIdAspiranteSutituto().equals(dtoSustitucion.getIdAspiranteSutituido())
                                && sustBD.getId().getIdSustitucion()
                                        .equals((dtoSustitucion.getId().getIdSustitucion() - 1))) {
                            response.getDtoSustitucionCAE().setCaeSustitucionDeSE((byte) 1);
                        }
                    }
                }
            }

            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
            if (response.getDtoSustitucionSE() != null
                    && response.getDtoSustitucionSE().getDtoSustituciones() != null) {
                if (response.getDtoSustitucionSE().getDtoSustituciones().getFechaBaja() != null) {
                    response.getDtoSustitucionSE().getDtoSustituciones().setStrFechaBaja(
                            dateFormat.format(response.getDtoSustitucionSE().getDtoSustituciones().getFechaBaja()));
                }

                if (response.getDtoSustitucionSE().getDtoSustituciones().getFechaAlta() != null) {
                    response.getDtoSustitucionSE().getDtoSustituciones().setStrFechaAlta(
                            dateFormat.format(response.getDtoSustitucionSE().getDtoSustituciones().getFechaAlta()));
                }
            }
            if (response.getDtoSustitucionCAE() != null
                    && response.getDtoSustitucionCAE().getDtoSustituciones() != null) {
                if (response.getDtoSustitucionCAE().getDtoSustituciones().getFechaBaja() != null) {
                    response.getDtoSustitucionCAE().getDtoSustituciones().setStrFechaBaja(
                            dateFormat.format(response.getDtoSustitucionCAE().getDtoSustituciones().getFechaBaja()));
                }

                if (response.getDtoSustitucionCAE().getDtoSustituciones().getFechaAlta() != null) {
                    response.getDtoSustitucionCAE().getDtoSustituciones().setStrFechaAlta(
                            dateFormat.format(response.getDtoSustitucionCAE().getDtoSustituciones().getFechaAlta()));
                }
            }

            return response;
        } catch (Exception e) {
            log.error("Error en el metodo ontenerInformacionSustitucion de ASCatalogoImpl: " + e);
            return null;
        }
    }

    private ModelResponseListaSustitutos colocarCategoriasSustitutosSE(List<ModelResponseSustitutos> sustitutos,
            Integer idDetalleProceso, Integer idParticipacion) {
        ModelResponseListaSustitutos response = new ModelResponseListaSustitutos();
        List<ModelResponseCategoriaSustitutos> categoriasList = new ArrayList<>();
        List<Integer> array = repoJPACCausasVacante.obtenerArrayPendientesSustSeCae(idDetalleProceso, idParticipacion);
        for (CategoriasSustitutosSup cat : CategoriasSustitutosSup.values()) {
            Integer categoria = cat.ordinal() + 1;
            ModelResponseCategoriaSustitutos categoriaObj = new ModelResponseCategoriaSustitutos();
            Integer cantidadSustitutos = cantidadSustitutos(sustitutos, categoria);
            categoriaObj.setTitle(cat.toString() + " (" + cantidadSustitutos + ")");
            categoriaObj.setSelectable(false);
            categoriaObj.setKey(
                    Integer.parseInt(String.valueOf(categoria) + String.valueOf(categoria) + String.valueOf(categoria)
                            + String.valueOf(categoria) + String.valueOf(categoria)));
            categoriaObj.setValue(
                    Integer.parseInt(String.valueOf(categoria) + String.valueOf(categoria) + String.valueOf(categoria)
                            + String.valueOf(categoria) + String.valueOf(categoria)));
            List<Object> sustitutosList = new ArrayList<>();
            for (ModelResponseSustitutos sustituto : sustitutos) {
                if (sustituto.getCategoria() != null) {
                    if (array != null && !array.isEmpty()) {
                        if (array.contains(sustituto.getIdAspirante())) {
                            sustituto.setDisabled(true);
                        } else {
                            sustituto.setDisabled(false);
                        }
                    } else {
                        sustituto.setDisabled(false);
                    }
                    if (sustituto.getCategoria().equals(categoria)) {
                        sustitutosList.add(sustituto);
                    }
                }
            }
            categoriaObj.setChildren(sustitutosList);
            categoriasList.add(categoriaObj);
        }
        response.setCategoriasSustitutos(categoriasList);
        return response;
    }

    private ModelResponseListaSustitutos colocarCategoriasSustitutosCAE(List<ModelResponseSustitutos> sustitutos,
            Integer idDetalleProceso, Integer idParticipacion) {
        ModelResponseListaSustitutos response = new ModelResponseListaSustitutos();
        List<ModelResponseCategoriaSustitutos> categoriasList = new ArrayList<>();
        List<Object> categoriaListaReserva = new ArrayList<>();
        List<Integer> array = repoJPACCausasVacante.obtenerArrayPendientesSustSeCae(idDetalleProceso, idParticipacion);
        ModelResponseCategoriaSustitutos categListaReservaObj = new ModelResponseCategoriaSustitutos();
        categListaReservaObj.setTitle(
                "Lista de reserva de CAE con evaluación integral (" + cantidadSustitutosListaReserva(sustitutos) + ")");
        categListaReservaObj.setSelectable(false);
        categListaReservaObj.setKey(0);
        categListaReservaObj.setValue(0);
        for (CategoriasSustitutosCapa cat : CategoriasSustitutosCapa.values()) {
            Integer categoria = cat.ordinal() + 1;
            ModelResponseCategoriaSustitutos categoriaObj = new ModelResponseCategoriaSustitutos();
            if (categoria <= 4) {
                Integer cantidadSustitutos = cantidadSustitutos(sustitutos, categoria);
                categoriaObj.setTitle(cat.toString() + " (" + cantidadSustitutos + ")");
                categoriaObj.setSelectable(false);
                categoriaObj.setKey(Integer
                        .parseInt(String.valueOf(categoria) + String.valueOf(categoria) + String.valueOf(categoria)
                                + String.valueOf(categoria) + String.valueOf(categoria) + String.valueOf(categoria)
                                + String.valueOf(categoria) + String.valueOf(categoria)));
                categoriaObj.setValue(Integer
                        .parseInt(String.valueOf(categoria) + String.valueOf(categoria) + String.valueOf(categoria)
                                + String.valueOf(categoria) + String.valueOf(categoria)));
                categoriaListaReserva.add(categoriaObj);
                List<Object> sustitutosList = new ArrayList<>();
                for (ModelResponseSustitutos sustituto : sustitutos) {
                    if (sustituto.getCategoria() != null) {
                        if (array != null && !array.isEmpty()) {
                            if (array.contains(sustituto.getIdAspirante())) {
                                sustituto.setDisabled(true);
                            } else {
                                sustituto.setDisabled(false);
                            }
                        } else {
                            sustituto.setDisabled(false);
                        }
                        if (sustituto.getCategoria().equals(categoria)) {
                            sustitutosList.add(sustituto);
                        }
                    }
                }
                categoriaObj.setChildren(sustitutosList);
            } else {
                Integer cantidadSustitutos = cantidadSustitutos(sustitutos, categoria);
                categoriaObj.setTitle(cat.toString() + " (" + cantidadSustitutos + ")");
                categoriaObj.setSelectable(false);
                categoriaObj.setKey(Integer
                        .parseInt(String.valueOf(categoria) + String.valueOf(categoria) + String.valueOf(categoria)
                                + String.valueOf(categoria) + String.valueOf(categoria)));
                categoriaObj.setValue(Integer
                        .parseInt(String.valueOf(categoria) + String.valueOf(categoria) + String.valueOf(categoria)
                                + String.valueOf(categoria) + String.valueOf(categoria)));
                List<Object> sustitutosList = new ArrayList<>();
                for (ModelResponseSustitutos sustituto : sustitutos) {
                    if (sustituto.getCategoria() != null) {
                        if (array != null && !array.isEmpty()) {
                            if (array.contains(sustituto.getIdAspirante())) {
                                sustituto.setDisabled(true);
                            } else {
                                sustituto.setDisabled(false);
                            }
                        } else {
                            sustituto.setDisabled(false);
                        }
                        if (sustituto.getCategoria().equals(categoria)) {
                            sustitutosList.add(sustituto);
                        }
                    }
                }
                categoriaObj.setChildren(sustitutosList);
                categoriasList.add(categoriaObj);
            }
        }
        categListaReservaObj.setChildren(categoriaListaReserva);
        List<ModelResponseCategoriaSustitutos> respuesta = new ArrayList<>();
        respuesta.add(categListaReservaObj);
        respuesta.addAll(categoriasList);
        response.setCategoriasSustitutos(respuesta);
        return response;
    }

    private Integer cantidadSustitutos(List<ModelResponseSustitutos> sustitutos, Integer categoria) {
        List<ModelResponseSustitutos> sust = sustitutos.stream()
                .filter(sustituto -> sustituto.getCategoria().equals(categoria))
                .collect(Collectors.toList());
        return sust.size();
    }

    private Integer cantidadSustitutosListaReserva(List<ModelResponseSustitutos> sustitutos) {
        List<ModelResponseSustitutos> sust = sustitutos.stream()
                .filter(sustituto -> sustituto.getCategoria() < 5)
                .collect(Collectors.toList());
        return sust.size();
    }

}
