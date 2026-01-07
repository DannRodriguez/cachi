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
public class DTOEstadoDetalles extends DTOEstadosMultiProceso implements Serializable {

    private Map<Integer, DTODetalleParticipaciones> detalles;

}
