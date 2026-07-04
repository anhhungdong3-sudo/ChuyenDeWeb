package com.exam.config;

import com.exam.entity.Category;
import com.exam.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedDefaultCategories(CategoryRepository categoryRepository) {
        return args -> {
            List<String> names = List.of(
                    "Van hoc",
                    "Kinh te",
                    "Ky nang song",
                    "Thieu nhi",
                    "Giao trinh",
                    "Truyen tranh"
            );

            for (String name : names) {
                if (!categoryRepository.existsByName(name)) {
                    Category category = new Category();
                    category.setName(name);
                    category.setDescription("Danh muc sach " + name);
                    categoryRepository.save(category);
                }
            }
        };
    }
}
