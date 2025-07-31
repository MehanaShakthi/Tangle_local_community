package com.tangle.service;

import com.tangle.dto.LoginDto;
import com.tangle.dto.UserRegistrationDto;
import com.tangle.entity.Community;
import com.tangle.entity.User;
import com.tangle.entity.UserRole;
import com.tangle.repository.CommunityRepository;
import com.tangle.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public User registerUser(UserRegistrationDto registrationDto) {
        // Check if user already exists
        if (userRepository.existsByEmail(registrationDto.getEmail()) || 
            userRepository.existsByPhoneNumber(registrationDto.getPhoneNumber())) {
            throw new RuntimeException("User with this email or phone number already exists");
        }

        // Find community by code
        Community community = communityRepository.findByCommunityCode(registrationDto.getCommunityCode())
            .orElseThrow(() -> new RuntimeException("Community not found with code: " + registrationDto.getCommunityCode()));

        // Create new user
        User user = new User();
        user.setFullName(registrationDto.getFullName());
        user.setEmail(registrationDto.getEmail());
        user.setPhoneNumber(registrationDto.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setAddress(registrationDto.getAddress());
        user.setLocality(registrationDto.getLocality());
        user.setPincode(registrationDto.getPincode());
        user.setCommunity(community);
                            user.setRole(UserRole.valueOf(registrationDto.getUserRole()));
        user.setIsActive(true);
        user.setIsVerified(false);

        return userRepository.save(user);
    }

    public String loginUser(LoginDto loginDto) {
        // Find user by email or phone number
        Optional<User> userOpt = userRepository.findByEmailOrPhoneNumber(loginDto.getEmailOrPhone(), loginDto.getEmailOrPhone());
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userOpt.get();

        // Check password
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate JWT token
        return jwtService.generateToken(user);
    }

    public User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmailOrPhoneNumber(userDetails.getUsername(), userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getUsersByCommunity(Long communityId) {
        return userRepository.findByCommunityId(communityId);
    }

    public List<User> getUsersByCommunityAndRole(Long communityId, UserRole role) {
        return userRepository.findByCommunityIdAndUserRole(communityId, role);
    }

    public User updateUserProfile(Long userId, Map<String, String> updates) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("fullName")) {
            user.setFullName(updates.get("fullName"));
        }
        if (updates.containsKey("address")) {
            user.setAddress(updates.get("address"));
        }
        if (updates.containsKey("locality")) {
            user.setLocality(updates.get("locality"));
        }
        if (updates.containsKey("pincode")) {
            user.setPincode(updates.get("pincode"));
        }
        if (updates.containsKey("profilePicture")) {
            user.setProfilePicture(updates.get("profilePicture"));
        }

        return userRepository.save(user);
    }

    public Map<String, Object> getUserStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Get user's post count
        long postCount = userRepository.countPostsByUserId(userId);
        stats.put("totalPosts", postCount);
        
        // Get total views on user's posts
        long totalViews = userRepository.sumViewsByUserId(userId);
        stats.put("totalViews", totalViews);
        
        // Get total comments on user's posts
        long totalComments = userRepository.countCommentsByUserId(userId);
        stats.put("totalComments", totalComments);
        
        return stats;
    }

    public User verifyUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsVerified(true);
        return userRepository.save(user);
    }

    public User deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        return userRepository.save(user);
    }
} 