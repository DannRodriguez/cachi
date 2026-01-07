package mx.ine.sustseycae.dto.db;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.ColumnResult;
import jakarta.persistence.ConstructorResult;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.NamedNativeQuery;
import jakarta.persistence.SqlResultSetMapping;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import mx.ine.sustseycae.dto.vo.VOEstadosProcesosHistoricos;

@SqlResultSetMapping(name = "estadosProcesosHistoricos", classes = {
    @ConstructorResult(targetClass = VOEstadosProcesosHistoricos.class, columns = {
        @ColumnResult(name = "idProceso", type = Integer.class),
        @ColumnResult(name = "nombreProceso", type = String.class),
        @ColumnResult(name = "idDetalle", type = Integer.class),
        @ColumnResult(name = "nombreDetalle", type = String.class),
        @ColumnResult(name = "idParticipacion", type = Integer.class),
        @ColumnResult(name = "idEstado", type = Integer.class),
        @ColumnResult(name = "nombreEstado", type = String.class),
        @ColumnResult(name = "idDistrito", type = Integer.class),
        @ColumnResult(name = "nombreDistrito", type = String.class)})})

@NamedNativeQuery(name = "DTOCProcesosHistoricosSust.obtieneEstadoDetalleHistoricos", query = """
        SELECT DP.ID_PROCESO_ELECTORAL idProceso, DP.NOMBRE_PROCESO nombreProceso,
              DP.ID_DETALLE_PROCESO idDetalle, DP.NOMBRE_DETALLE nombreDetalle,
              P.ID_PARTICIPACION idParticipacion,
              P.ID_ESTADO idEstado, NVL(E.NOMBRE_ESTADO, ' ') AS nombreEstado,
              P.ID_DISTRITO idDistrito,
              CASE WHEN P.ID_ESTADO = 0 THEN 'JUNTA LOCAL' ELSE
              NVL(DF.CABECERA_DISTRITAL_FEDERAL, '') END  AS nombreDistrito
              FROM SUPYCAP.C_PROCESOS_HISTORICOS_SUST DP
              JOIN SUPYCAP.PARTICIPACION_GEO_HIST_SUST P
              ON (DP.ID_DETALLE_PROCESO = P.ID_DETALLE_PROCESO)
              LEFT JOIN GEOGRAFICOINE.ESTADOS E
              ON (P.ID_ESTADO = E.ID_ESTADO AND E.ID_CORTE = DP.ID_CORTE)
              LEFT JOIN GEOGRAFICOINE.DISTRITOS_FEDERALES DF
              ON (P.ID_ESTADO = DF.ID_ESTADO AND P.ID_DISTRITO = DF.ID_DISTRITO_FEDERAL
              AND DF.ID_CORTE = DP.ID_CORTE)
              WHERE DP.HISTORICO = 'S' AND (:idEstado = 0 OR P.ID_ESTADO = :idEstado)
              AND (:idDistrito = 0 OR P.ID_DISTRITO = :idDistrito)
              ORDER BY P.ID_ESTADO, P.ID_DETALLE_PROCESO, P.ID_PARTICIPACION""", resultSetMapping = "estadosProcesosHistoricos")

@Entity
@Table(schema = "SUPYCAP", name = "C_PROCESOS_HISTORICOS_SUST")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class DTOCProcesosHistoricosSust implements Serializable {

    @EmbeddedId
    private DTOCProcesosHistoricosSustId id;

    @NotNull
    @Column(name = "ID_PROCESO_ELECTORAL", nullable = false, precision = 5, scale = 0)
    private Integer idProcesoElectoral;

    @NotNull
    @Column(name = "NOMBRE_PROCESO", nullable = false, length = 220)
    private String nombreProceso;

    @NotNull
    @Column(name = "NOMBRE_DETALLE", nullable = false, length = 220)
    private String nombreDetalle;

    @NotNull
    @Column(name = "HISTORICO", nullable = false, length = 1)
    private String historico;

    @NotNull
    @Column(name = "ID_CORTE", precision = 1, scale = 0)
    private Integer idCorte;

}
