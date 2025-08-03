package com.tangle.controller;

import com.tangle.entity.Report;
import com.tangle.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody Report report, Authentication authentication) {
        return ResponseEntity.ok(reportService.createReport(report, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Report> updateReportStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(reportService.updateReportStatus(id, status));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Report>> getReportsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reportService.getReportsByUserId(userId));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Report>> getReportsByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(reportService.getReportsByPostId(postId));
    }
} 