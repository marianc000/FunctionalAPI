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

    List<String> allClasses() throws IOException {

        var isClass = Pattern.compile("[^-$]+\\.class").asMatchPredicate();
        var PACKAGES = List.of("java", "javax");

        var root = Paths.get(URI.create("jrt:/")).resolve("/modules");

        return Files.walk(root)
                .filter(p -> isClass.test(p.getFileName().toString()))
                .map(p -> p.subpath(2, p.getNameCount()))
                .filter(p -> PACKAGES.contains(p.getName(0).toString()))
                .map(p -> p.toString().replace('/', '.').replace(".class", ""))
                .filter(s -> {
                    try {
                        return Modifier.isPublic(Class.forName(s).getModifiers());
                    } catch (Exception ex) {
                        return false;
                    }
                })
                .toList();
    }

    void run() throws IOException {
        Files.write(OUT_PATH, allClasses());
    }

    public static void main(String[] args) throws Exception {
        new Classes().run();
    }
}
