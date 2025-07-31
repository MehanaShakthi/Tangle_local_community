package com.tangle.service;

import com.tangle.dto.PostDto;
import com.tangle.entity.*;
import com.tangle.repository.CommentRepository;
import com.tangle.repository.PostRepository;
import com.tangle.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ReportRepository reportRepository;

    public Post createPost(PostDto postDto, User user) {
        Post post = new Post();
        post.setTitle(postDto.getTitle());
        post.setDescription(postDto.getDescription());
        post.setCategory(PostCategory.valueOf(postDto.getCategory()));
        post.setType(PostType.valueOf(postDto.getType()));
        post.setUser(user);
        post.setCommunity(user.getCommunity());
        post.setContactInfo(postDto.getContactInfo());
        post.setPrice(postDto.getPrice());
        post.setLocation(postDto.getLocation());
        post.setImages(postDto.getImages());
        post.setIsUrgent(postDto.getIsUrgent());
        post.setIsFeatured(postDto.getIsFeatured());
        
        return postRepository.save(post);
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public Page<Post> getPostsByCommunity(Long communityId, Pageable pageable) {
        return postRepository.findByCommunityId(communityId, pageable);
    }

    public Page<Post> getPostsByCategory(Long communityId, PostCategory category, Pageable pageable) {
        return postRepository.findByCommunityIdAndCategory(communityId, category, pageable);
    }

    public Page<Post> searchPosts(Long communityId, String searchTerm, Pageable pageable) {
        return postRepository.searchPostsInCommunity(communityId, searchTerm, pageable);
    }

    public List<Post> getPostsByUser(Long userId) {
        return postRepository.findByUserId(userId);
    }

    public Map<String, Object> getPostStats(Long communityId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPosts", postRepository.countByCommunityId(communityId));
        stats.put("myPosts", 0); // Will be calculated per user
        stats.put("urgentPosts", postRepository.findUrgentPostsByCommunityId(communityId).size());
        stats.put("communityMembers", 0); // Will be calculated from user service
        return stats;
    }

    public Comment addComment(Long postId, String content, User user) {
        Post post = getPostById(postId);
        
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setUser(user);
        comment.setPost(post);
        
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
    }

    public void reportPost(Long postId, String reason, String type, User reporter) {
        Post post = getPostById(postId);
        
        Report report = new Report();
        report.setReason(reason);
        report.setType(ReportType.valueOf(type));
        report.setReporter(reporter);
        report.setPost(post);
        report.setReportedUser(post.getUser());
        
        reportRepository.save(report);
    }
} 