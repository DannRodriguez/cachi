package mx.ine.sustseycae.dto.vo;

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
public class VOObjectsListaReservaSe extends VOListaReservaSE {

	private static final long serialVersionUID = -5334323009735722293L;

	private Integer idObjeto;
	private Integer estatusLista;
	private String cellColorBackground;
	private Integer numCriterioOrden;
	private String sede;

}
