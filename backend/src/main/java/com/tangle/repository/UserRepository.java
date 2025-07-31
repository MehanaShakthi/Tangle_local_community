package com.tangle.repository;

import com.tangle.entity.User;
import com.tangle.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmailOrPhoneNumber(String email, String phoneNumber);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhoneNumber(String phoneNumber);
    
    List<User> findByCommunityId(Long communityId);
    
    List<User> findByCommunityIdAndUserRole(Long communityId, UserRole role);
    
    @Query("SELECT COUNT(p) FROM Post p WHERE p.user.id = :userId")
    long countPostsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COALESCE(SUM(p.viewCount), 0) FROM Post p WHERE p.user.id = :userId")
    long sumViewsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.user.id = :userId")
    long countCommentsByUserId(@Param("userId") Long userId);
} 