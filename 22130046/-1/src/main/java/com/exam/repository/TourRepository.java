package com.exam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.exam.model.Tour;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
}