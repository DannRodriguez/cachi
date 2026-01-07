package mx.ine.sustseycae.as.impl;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.jboss.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.ine.sustseycae.as.ASReportesHistoricos;
import mx.ine.sustseycae.dto.DTODetalleParticipaciones;
import mx.ine.sustseycae.dto.DTOEstadoDetalles;
import mx.ine.sustseycae.dto.DTOParticipacion;
import mx.ine.sustseycae.dto.vo.VOEstadosProcesosHistoricos;
import mx.ine.sustseycae.models.responses.ModelGenericResponse;
import mx.ine.sustseycae.repositories.RepoJPAReportesHistoricos;
import mx.ine.sustseycae.util.Constantes;

@Service("asReportesHistoricos")
public class ASReportesHistoricosImpl implements ASReportesHistoricos {

    private static final Logger logger = Logger.getLogger(ASReportesHistoricosImpl.class);

    @Autowired
    private RepoJPAReportesHistoricos repoJPAReportesHistoricos;

    @Override
    public ModelGenericResponse obtieneEstadoDetalleHistoricos(Integer idEstado, Integer idDistrito) {
        ModelGenericResponse response = new ModelGenericResponse();
        try {
            Map<Integer, DTOEstadoDetalles> mapEstados = new LinkedHashMap<>();
            List<VOEstadosProcesosHistoricos> lista = repoJPAReportesHistoricos.obtieneEstadoDetalleHistoricos(idEstado,
                    idDistrito);
            if (lista != null) {
                for (VOEstadosProcesosHistoricos vo : lista) {
                    Integer idEstadoHistorico = vo.getIdEstado();
                    Integer idDetalle = vo.getIdDetalle();
                    Integer idDistritoHistorico = vo.getIdDistrito();
                    DTOEstadoDetalles dtoEstadoDetalles = new DTOEstadoDetalles();
                    dtoEstadoDetalles.setIdEstado(idEstadoHistorico);
                    dtoEstadoDetalles.setNombreEstado(vo.getNombreEstado());
                    dtoEstadoDetalles.setDetalles(new LinkedHashMap<>());

                    mapEstados.putIfAbsent(idEstadoHistorico, dtoEstadoDetalles);

                    mapEstados.get(idEstadoHistorico).getDetalles().putIfAbsent(idDetalle,
                            new DTODetalleParticipaciones(vo.getIdProceso(), vo.getNombreProceso(), idDetalle,
                                    vo.getNombreDetalle(), new LinkedHashMap<>()));

                    mapEstados.get(idEstadoHistorico).getDetalles().get(idDetalle).getParticipaciones().put(
                            idDistritoHistorico,
                            new DTOParticipacion(idDistritoHistorico, vo.getIdDistrito(), vo.getNombreDistrito()));
                }
            }
            response.setCode(Constantes.RESPONSE_CODE_200);
            response.setMessage(Constantes.ESTATUS_EXITO);
            response.setData(mapEstados);
            return response;
        } catch (Exception e) {
            logger.error("ERROR ASReportesHistoricosImpl -obtieneEstadoDetalleHistoricos: ", e);
            response.setStatus(Constantes.ESTATUS_ERROR);
            response.setCode(Constantes.RESPONSE_CODE_500);
            response.setMessage("Ocurrio un error al obtener los estados y procesos.");
            return response;
        }
    }

}
