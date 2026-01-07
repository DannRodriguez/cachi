package mx.ine.sustseycae.controllers.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import jakarta.validation.Valid;
import mx.ine.sustseycae.bsd.BSDReportesHistoricos;
import mx.ine.sustseycae.controllers.ControllerReportesHistoricos;
import mx.ine.sustseycae.models.requests.ModelRequestGeograficoHistorico;
import mx.ine.sustseycae.models.responses.ModelGenericResponse;

@Controller
public class ControllerReportesHistoricosImlp implements ControllerReportesHistoricos {

    @Autowired
    private BSDReportesHistoricos bsdReportesHistoricos;

    @Override
    public ModelGenericResponse obtieneEstadoDetalleHistoricos(@Valid ModelRequestGeograficoHistorico model) {
        return bsdReportesHistoricos.obtieneEstadoDetalleHistoricos(model.getIdEstado(), model.getIdDistrito());
    }

}
