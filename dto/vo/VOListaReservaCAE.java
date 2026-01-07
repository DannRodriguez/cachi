package mx.ine.sustseycae.dto.vo;

import java.io.Serializable;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.PositiveOrZero;
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
public class VOListaReservaCAE implements Serializable {

    private static final long serialVersionUID = 8876498010316711929L;

    private Integer num;

    @PositiveOrZero
    @Digits(integer = 5, fraction = 0)
    private Integer idProceso;

    @PositiveOrZero
    @Digits(integer = 7, fraction = 0)
    private Integer idDetalle;

    @PositiveOrZero
    @Digits(integer = 3, fraction = 0)
    private Integer idParticipacion;

    private Integer idSedeReclutamiento;
    private Integer numSede;
    private String lugarSede;

    @PositiveOrZero
    @Digits(integer = 6, fraction = 0)
    private Integer idAspirante;

    private String nombreAspirante;
    private Integer puesto;
    private String evaluacionInteCAE;
    private String representantePP;
    private String militantePP;
    private Integer estatusListaReserva;
    private String observaciones;
    private Boolean regModificado;

}
