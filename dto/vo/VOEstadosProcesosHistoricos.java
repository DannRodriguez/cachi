package mx.ine.sustseycae.dto.vo;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class VOEstadosProcesosHistoricos implements Serializable {

    private Integer idProceso;
    private String nombreProceso;
    private Integer idDetalle;
    private String nombreDetalle;
    private Integer idParticipacion;
    private Integer idEstado;
    private String nombreEstado;
    private Integer idDistrito;
    private String nombreDistrito;
}
