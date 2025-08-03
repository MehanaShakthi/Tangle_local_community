package com.tangle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tangle.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Tangle Community App is running");
        response.put("timestamp", System.currentTimeMillis());
        
        try {
            long userCount = userRepository.count();
            response.put("database", "CONNECTED");
            response.put("userCount", userCount);
        } catch (Exception e) {
            response.put("database", "ERROR: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> apiHealthCheck() {
        return healthCheck();
    }
} 