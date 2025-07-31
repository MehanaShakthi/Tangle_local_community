package com.tangle.repository;

import com.tangle.entity.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
    
    Optional<Community> findByCommunityCode(String communityCode);
    
    Optional<Community> findByNameAndCity(String name, String city);
    
    @Query("SELECT c FROM Community c WHERE c.city = :city AND c.isActive = true")
    List<Community> findByCity(@Param("city") String city);
    
    @Query("SELECT c FROM Community c WHERE c.pincode = :pincode AND c.isActive = true")
    List<Community> findByPincode(@Param("pincode") String pincode);
    
    @Query("SELECT c FROM Community c WHERE c.isActive = true")
    List<Community> findActiveCommunities();
    
    boolean existsByCommunityCode(String communityCode);
    
    boolean existsByNameAndCity(String name, String city);
} 