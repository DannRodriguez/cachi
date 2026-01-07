package mx.ine.sustseycae.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import mx.ine.sustseycae.models.requests.ModelRequestGeograficoHistorico;
import mx.ine.sustseycae.models.responses.ModelGenericResponse;

@RestController
@RequestMapping("ws")
public interface ControllerReportesHistoricos {

    @PostMapping(path = "/obtieneEstadoDetalleHistoricos")
    public @ResponseBody
    ModelGenericResponse obtieneEstadoDetalleHistoricos(
            @RequestBody @Valid ModelRequestGeograficoHistorico model);

}
