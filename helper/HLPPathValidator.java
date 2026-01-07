package mx.ine.sustseycae.helper;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Collectors;

public class HLPPathValidator {

    private HLPPathValidator() {
        throw new IllegalStateException("HLPPathValidator is an utility class");
    }

    public static Path obtenerArchivo(String nombreArchivo) {
        String cad = (nombreArchivo).replaceAll("\\.{2,}", ".").replaceAll("\\s{2,}", " ").replaceAll("\\s+$", "");

        cad = cad.chars()
                .mapToObj(i -> (char) i)
                .map(c -> Character.isWhitespace(c) ? ' ' : c)
                .filter(c
                        -> Character.isLetterOrDigit(c)
                || c == ' ' || c == '-' || c == '_'
                || c == '.' || c == ':' || c == '/'
                || c == '\\' || c == '+' || c == '='
                || c == '@'
                )
                .map(String::valueOf)
                .collect(Collectors.joining());

        Path baseRuta = Paths.get(cad).normalize();
        return baseRuta;
    }

}
