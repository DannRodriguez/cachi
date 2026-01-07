package mx.ine.sustseycae.dto;

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
public class DTOParticipacion implements Serializable {

    private Integer idParticipacion;
    private Integer idDistrito;
    private String nombreDistrito;

}
