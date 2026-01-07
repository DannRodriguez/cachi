package mx.ine.sustseycae.bsd;

import java.io.Serializable;

import mx.ine.sustseycae.models.responses.ModelGenericResponse;

public interface BSDReportesHistoricos extends Serializable {

    public ModelGenericResponse obtieneEstadoDetalleHistoricos(Integer idEstado, Integer idDistrito);

}
