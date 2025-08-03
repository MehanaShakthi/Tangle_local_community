package com.tangle.service;

import com.tangle.entity.Report;
import com.tangle.entity.ReportStatus;
import com.tangle.entity.User;
import com.tangle.repository.ReportRepository;
import com.tangle.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    public Report createReport(Report report, String userEmail) {
        User reporter = userRepository.findByEmailOrPhoneNumber(userEmail, userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        report.setReporter(reporter);
        report.setStatus(ReportStatus.PENDING);
        report.setCreatedAt(LocalDateTime.now());
        report.setUpdatedAt(LocalDateTime.now());

        return reportRepository.save(report);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Report getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    public Report updateReportStatus(Long id, String status) {
        Report report = getReportById(id);
        report.setStatus(ReportStatus.valueOf(status.toUpperCase()));
        report.setUpdatedAt(LocalDateTime.now());
        return reportRepository.save(report);
    }

    public List<Report> getReportsByUserId(Long userId) {
        return reportRepository.findByReportedUserId(userId);
    }

    public List<Report> getReportsByPostId(Long postId) {
        return reportRepository.findByPostId(postId);
    }
} 