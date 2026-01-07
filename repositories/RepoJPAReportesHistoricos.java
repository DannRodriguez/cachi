package mx.ine.sustseycae.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mx.ine.sustseycae.dto.db.DTOCProcesosHistoricosSust;
import mx.ine.sustseycae.dto.db.DTOCProcesosHistoricosSustId;
import mx.ine.sustseycae.dto.vo.VOEstadosProcesosHistoricos;

public interface RepoJPAReportesHistoricos
        extends JpaRepository<DTOCProcesosHistoricosSust, DTOCProcesosHistoricosSustId> {

    @Query(nativeQuery = true)
    public List<VOEstadosProcesosHistoricos> obtieneEstadoDetalleHistoricos(@Param("idEstado") Integer idEstado,
            @Param("idDistrito") Integer idDistrito);

}
