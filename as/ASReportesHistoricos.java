package mx.ine.sustseycae.as;

import java.io.Serializable;

import mx.ine.sustseycae.models.responses.ModelGenericResponse;

public interface ASReportesHistoricos extends Serializable {

    public ModelGenericResponse obtieneEstadoDetalleHistoricos(Integer idEstado, Integer idDistrito);

}
