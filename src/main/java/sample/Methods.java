package sample;

import java.io.IOException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import static sample.Constants.OUT_PATH;
import static sample.Constants.OUT_PATH2;

public class Methods {

    void run() throws IOException {
        List<String> classes = Files.readAllLines(OUT_PATH);
        Files.write(OUT_PATH2, getMethods(classes));
    }

    List<String> getMethods(List<String> classes) throws IOException {

        return classes.stream().map(s -> {
            try {
                return Class.forName(s);
            } catch (Exception ex) {
                return null;
            }
        })
                .filter(c -> c != null)
                .flatMap(c -> Arrays.stream(c.getMethods())
                .filter(m -> c.isInterface()
                || (Modifier.isPublic(m.getModifiers())
                && !Modifier.isAbstract(m.getModifiers())
                && !Modifier.isNative(m.getModifiers())))
                .map(m -> methodToString(m, c.getTypeName()))
                )
                .collect(Collectors.toList());
    }

    String methodToString(Method m, String clazz) {
        List<String> row = new LinkedList<>();
        row.add(m.getReturnType().getTypeName());
        row.add(clazz);
        //   row.add(m.getDeclaringClass().getTypeName());
        row.add(m.getName());

        row.add(Arrays.stream(m.getParameterTypes()).map(Type::getTypeName).collect(Collectors.joining(",")));

        Class<?>[] exceptionTypes = m.getExceptionTypes();
        String exceptions = "";
        if (exceptionTypes.length > 0) {
            exceptions = Arrays.stream(exceptionTypes).map(Type::getTypeName).collect(Collectors.joining(","));
        }
        row.add(exceptions);
        return String.join("\t", row);

    }

    public static void main(String[] args) throws Exception {
        new Methods().run();
    }
}
