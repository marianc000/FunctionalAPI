package sample;

import java.io.IOException;
import java.lang.reflect.Modifier;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.regex.Pattern;
import static sample.Constants.OUT_PATH;

public class Classes {

    Pattern CLASS_PATTERN = Pattern.compile("^[^-$]+\\.class$");
    List<String> PACKAGES = List.of("java", "javax");

    void run() throws IOException {
        Path root = Paths.get(URI.create("jrt:/")).resolve("/modules");
        List<String> classes = Files.walk(root)
                .filter(p -> CLASS_PATTERN.matcher(p.getFileName().toString()).matches())
                .map(p -> p.subpath(2, p.getNameCount()))
                .filter(p -> PACKAGES.contains(p.getName(0).toString()))
                .map(p -> p.toString().replace('/', '.').replace(".class", ""))
                .filter(s -> {
                    try {
                        return Modifier.isPublic(Class.forName(s).getModifiers());
                    } catch (Exception ex) {
                        ex.printStackTrace();
                        return false;
                    }
                })
                .toList();
 
        Files.write(OUT_PATH, classes);
    }

    public static void main(String[] args) throws Exception {
        new Classes().run();
    }
}
