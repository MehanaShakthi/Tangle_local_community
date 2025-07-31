package com.tangle.controller;

import com.tangle.dto.PostDto;
import com.tangle.entity.Post;
import com.tangle.entity.PostCategory;
import com.tangle.entity.PostType;
import com.tangle.entity.User;
import com.tangle.service.PostService;
import com.tangle.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody PostDto postDto) {
        try {
            User currentUser = userService.getCurrentUser();
            Post post = postService.createPost(postDto, currentUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Post created successfully");
            response.put("postId", post.getId());
            response.put("title", post.getTitle());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<?> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        try {
            User currentUser = userService.getCurrentUser();
            PageRequest pageRequest = PageRequest.of(page, size);
            
            Page<Post> posts;
            if (category != null && !category.equals("ALL")) {
                posts = postService.getPostsByCategory(currentUser.getCommunity().getId(), 
                    PostCategory.valueOf(category), pageRequest);
            } else if (search != null && !search.trim().isEmpty()) {
                posts = postService.searchPosts(currentUser.getCommunity().getId(), search, pageRequest);
            } else {
                posts = postService.getPostsByCommunity(currentUser.getCommunity().getId(), pageRequest);
            }
            
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPost(@PathVariable Long id) {
        try {
            Post post = postService.getPostById(id);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/my-posts")
    public ResponseEntity<?> getMyPosts() {
        try {
            User currentUser = userService.getCurrentUser();
            return ResponseEntity.ok(postService.getPostsByUser(currentUser.getId()));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getPostStats() {
        try {
            User currentUser = userService.getCurrentUser();
            Map<String, Object> stats = postService.getPostStats(currentUser.getCommunity().getId());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            User currentUser = userService.getCurrentUser();
            String content = request.get("content");
            return ResponseEntity.ok(postService.addComment(id, content, currentUser));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(postService.getCommentsByPost(id));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<?> reportPost(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            User currentUser = userService.getCurrentUser();
            String reason = request.get("reason");
            String type = request.get("type");
            postService.reportPost(id, reason, type, currentUser);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Post reported successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 