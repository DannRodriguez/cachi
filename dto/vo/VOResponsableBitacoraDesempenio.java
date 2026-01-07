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
public class VOResponsableBitacoraDesempenio implements Serializable {

	private static final long serialVersionUID = 248150276652230892L;

	private Integer idDetalleProceso;
	private Integer idParticipacion;
	private Integer idBitacoraDesempenio;
	private Integer idResponsableBitacora;
	private Integer idPuestoFuncionario;
	private String tipoPuesto;
	private String inicialesPuesto;
	private String nombre;
	private String apellidoPaterno;
	private String apellidoMaterno;
	private String tratamiento;
	private Integer idPuesto;

}
