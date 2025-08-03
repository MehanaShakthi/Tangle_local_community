package com.tangle.service;

import com.tangle.entity.Community;
import com.tangle.repository.CommunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommunityService {

    @Autowired
    private CommunityRepository communityRepository;

    public List<Community> getAllCommunities() {
        return communityRepository.findAll();
    }

    public Optional<Community> getCommunityById(Long id) {
        return communityRepository.findById(id);
    }

    public Optional<Community> getCommunityByCode(String code) {
        return communityRepository.findByCommunityCode(code);
    }

    public Community createCommunity(Community community) {
        // Generate a unique community code if not provided
        if (community.getCommunityCode() == null || community.getCommunityCode().isEmpty()) {
            community.setCommunityCode(generateCommunityCode(community.getName()));
        }
        return communityRepository.save(community);
    }

    public List<Community> searchCommunities(String query) {
        return communityRepository.searchCommunities(query);
    }

    private String generateCommunityCode(String name) {
        // Simple code generation - you can make this more sophisticated
        String baseCode = name.replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
        if (baseCode.length() > 6) {
            baseCode = baseCode.substring(0, 6);
        }
        return baseCode + System.currentTimeMillis() % 1000;
    }
} 