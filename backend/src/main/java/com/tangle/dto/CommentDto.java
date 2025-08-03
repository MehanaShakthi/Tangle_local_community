package com.tangle.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CommentDto {
    
    @NotNull(message = "Post ID is required")
    private Long postId;
    
    @NotBlank(message = "Comment content is required")
    private String content;

    // Getters and Setters
    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
} 