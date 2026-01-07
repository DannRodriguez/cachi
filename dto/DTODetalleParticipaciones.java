package mx.ine.sustseycae.dto;

import java.io.Serializable;
import java.util.Map;

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
public class DTODetalleParticipaciones implements Serializable {

    private Integer idProceso;
    private String nombreProceso;
    private Integer idDetalle;
    private String nombreDetalle;

    private Map<Integer, DTOParticipacion> participaciones;

}
