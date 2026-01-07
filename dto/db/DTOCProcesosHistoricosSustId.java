package mx.ine.sustseycae.dto.db;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class DTOCProcesosHistoricosSustId implements Serializable {

    @NotNull
    @Column(name = "ID_DETALLE_PROCESO", nullable = false, precision = 7, scale = 0)
    private Integer idDetalleProceso;

}
