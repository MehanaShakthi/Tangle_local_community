package com.tangle.repository;

import com.tangle.entity.Post;
import com.tangle.entity.PostCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    Page<Post> findByCommunityId(Long communityId, Pageable pageable);
    
    Page<Post> findByCommunityIdAndCategory(Long communityId, PostCategory category, Pageable pageable);
    
    List<Post> findByUserId(Long userId);
    
    Long countByCommunityId(Long communityId);
    
    @Query("SELECT p FROM Post p WHERE p.community.id = :communityId AND p.isUrgent = true")
    List<Post> findUrgentPostsByCommunityId(@Param("communityId") Long communityId);
    
    @Query("SELECT p FROM Post p WHERE p.community.id = :communityId AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Post> searchPostsInCommunity(@Param("communityId") Long communityId, 
                                     @Param("searchTerm") String searchTerm, 
                                     Pageable pageable);
} 