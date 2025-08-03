package com.tangle.service;

import com.tangle.entity.Comment;
import com.tangle.entity.Post;
import com.tangle.entity.User;
import com.tangle.repository.CommentRepository;
import com.tangle.repository.PostRepository;
import com.tangle.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
    }

    public Comment addComment(Comment comment, String userEmail) {
        User user = userRepository.findByEmailOrPhoneNumber(userEmail, userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Post post = postRepository.findById(comment.getPost().getId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        comment.setUser(user);
        comment.setPost(post);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId, String userEmail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        User user = userRepository.findByEmailOrPhoneNumber(userEmail, userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is the comment author or post author
        if (!comment.getUser().getId().equals(user.getId()) && 
            !comment.getPost().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    public List<Comment> getCommentsByUserId(Long userId) {
        return commentRepository.findByUserId(userId);
    }
} 