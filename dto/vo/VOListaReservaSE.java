package mx.ine.sustseycae.dto.vo;

import java.io.Serial;
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
public class VOListaReservaSE implements Serializable {

	@Serial
	private static final long serialVersionUID = 7402447743059010909L;

	private Integer idDetalle;
	private Integer idParticipacion;
	private Integer sedeReclutamiento;
	private Integer numSede;
	private String lugarSede;
	private Integer idAspirante;
	private String nombreCae;
	private Integer puesto;
	private String evaluacionIntSe;
	private String evaluacionIntSeAux;
	private String evaluacionIntCae;
	private String evaluacionIntCaeAux;
	private String domicilio;
	private String telefono;
	private String celular;
	private String correo;
	private String escolaridad;
	private String carrera;
	private String declinaEntrevistaSe;
	private Integer estatusListaReserva;
	private String imparteCapacit;
	private String experienciaGrupos;
	private String disponibleTiempo;
	private Integer tieneEvaluacion;
	private Integer declinaEntSe;
	private String participoProceso;

}
