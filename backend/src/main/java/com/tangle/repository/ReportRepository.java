package com.tangle.repository;

import com.tangle.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByReporterId(Long reporterId);
    
    List<Report> findByReportedUserId(Long reportedUserId);
    
    List<Report> findByPostId(Long postId);
    
    List<Report> findByStatus(String status);
} 