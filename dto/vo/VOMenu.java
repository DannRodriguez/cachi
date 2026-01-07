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
public class VOMenu implements Serializable {

	private static final long serialVersionUID = 1435470632437483002L;

	private Integer idMenu;
	private String nombreMenu;
	private Integer idSubmenu;
	private String nombreSubmenu;
	private Integer idModulo;
	private String nombreModulo;
	private String urlModulo;
	private Integer idAccion;
	private String accionDescrip;
	private String tipoJunta;
	private String estatus;
	private String tipoReporte;
	private Integer mostrarModulo;

}
