package com.exam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // Tự động quét sạch controller, service, repository, entity dưới package com.exam
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}