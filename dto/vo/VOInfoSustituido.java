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
public class VOInfoSustituido {

    private Integer idSustitucion;
    private String descripcion;
    private String fecha;
    private String observaciones;
    private Integer idDetalleProceso;
    private Integer idParticipacion;
    private Integer idAspirante;
    private String claveElectorFuar;
    private String aPaterno;
    private String aMaterno;
    private String nombre;
    private Integer idPuesto;
    private String urlFoto;
    private String idAreaResponsabilidad;
    private Integer idZonaResponsabilidad;
    private String cargoAnterior;
    private Integer folio;

}
