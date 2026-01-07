package mx.ine.sustseycae.bsd.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import mx.ine.sustseycae.as.ASReportesHistoricos;
import mx.ine.sustseycae.bsd.BSDReportesHistoricos;
import mx.ine.sustseycae.models.responses.ModelGenericResponse;

@Service("bsdReportesHistoricos")
@Scope("prototype")
public class BSDReportesHistoricosImpl implements BSDReportesHistoricos {

    @Autowired
    private ASReportesHistoricos asReportesHistoricos;

    @Override
    public ModelGenericResponse obtieneEstadoDetalleHistoricos(Integer idEstado, Integer idDistrito) {
        return asReportesHistoricos.obtieneEstadoDetalleHistoricos(idEstado, idDistrito);
    }

}
