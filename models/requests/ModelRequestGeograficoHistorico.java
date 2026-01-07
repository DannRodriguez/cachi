package mx.ine.sustseycae.models.requests;

import java.io.Serializable;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import mx.ine.sustseycae.util.Constantes;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ModelRequestGeograficoHistorico implements Serializable {

    @Min(value = 0, message = Constantes.MSG_REQUEST_ESTADO_MIN)
    @Max(value = 99, message = Constantes.MSG_REQUEST_ESTADO_MAX)
    private Integer idEstado;

    @Min(value = 0, message = "El distrito debe de ser mayor o igual a cero")
    @Max(value = 99, message = "El distrito no debe de ser mayor a 2 caracteres")
    private Integer idDistrito;

}
