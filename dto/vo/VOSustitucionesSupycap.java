package mx.ine.sustseycae.dto.vo;

import java.util.Date;

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
public class VOSustitucionesSupycap {

    private Integer idDetalleProceso;
    private Integer idParticipacion;
    private Integer idSustitucion;
    private Integer idProcesoElectoral;
    private String idRelacionSustituciones;
    private Integer idAspiranteSutituido;
    private Integer idPuestoSustituido;
    private String correoCtaCreadaSustituido;
    private String correoCtaNotifSustituido;
    private Integer idAspiranteSutituto;
    private Integer idPuestoSustituto;
    private String correoCtaCreadaSustituto;
    private String correoCtaNotifSustituto;
    private Integer idCausaVacante;
    private Integer tipoCausaVacante;
    private Date fechaBaja;
    private Date fechaAlta;
    private Date fechaSustitucion;
    private Integer idAreaResponsabilidad1e;
    private Integer idAZonaResponsabilidad1e;
    private Integer idAreaResponsabilidad2e;
    private Integer idZonaResponsabilidad2e;
    private String observaciones;
    private String uidCuentaSustituto;
    private String uidCuentaSustituido;
    private Integer declinoCargo;
    private Integer etapa;
    private String ipUsuario;
    private String usuario;
    private Date fechaHora;
    private Date fechaMovimiento;
    private String fechaBajaString;
    private String causaString;

}
