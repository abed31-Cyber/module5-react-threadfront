const API_URL = 'http://localhost:3000/posts';

// Fetch all posts
export async function fetchPosts() {
    const response = await fetch(API_URL, {
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    return response.json();
}

// Create a new post
export async function createPost(post) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(post),
    });
    if (!response.ok) {
        throw new Error('Failed to create post');
    }
    return response.json();
}

// Update a post
export async function updatePost(id, updatedPost) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedPost),
    });
    if (!response.ok) {
        throw new Error('Failed to update post');
    }
    return response.json();
}

// Delete a post
export async function deletePost(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to delete post');
    }
}