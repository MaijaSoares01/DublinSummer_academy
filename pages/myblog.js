document.addEventListener('DOMContentLoaded', () => {
    const titleFilter = document.getElementById('title-filter');
    const authorFilter = document.getElementById('author-filter');
    const sortOrder = document.getElementById('sort-order');
    const blogForm = document.getElementById('blog-form');
    const postList = document.getElementById('post-list');

    let posts = []; // Global variable to store all posts

    function loadPosts() {
        fetch('./posts.json') // Path to your local posts.json file
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse response as JSON
            })
            .then(data => {
                posts = data;
                populateAuthorFilter(posts);
                filterPosts(); // Apply initial filter and sort
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }

    function populateAuthorFilter(posts) {
        const authors = new Set();
        posts.forEach(post => authors.add(post.author));
        authorFilter.innerHTML = '<option value="">All Authors</option>';
        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author;
            option.textContent = author;
            authorFilter.appendChild(option);
        });
    }

    function filterPosts() {
        const titleQuery = titleFilter.value.toLowerCase();
        const authorQuery = authorFilter.value;
        const sortOption = sortOrder.value;

        let filteredPosts = posts.filter(post =>
            post.title.toLowerCase().includes(titleQuery) &&
            (authorQuery === '' || post.author === authorQuery)
        );

        // Sorting
        switch (sortOption) {
            case 'date-asc':
                filteredPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'date-desc':
                filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'title-asc':
                filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }

        populatePostList(filteredPosts); // Render the filtered and sorted posts
    }

    function populatePostList(posts) {
        postList.innerHTML = '';
        posts.forEach(post => {
            const listItem = document.createElement('li');
            listItem.dataset.title = post.title.toLowerCase();
            listItem.dataset.author = post.author.toLowerCase();
            listItem.innerHTML = `
                <span>${post.title} by ${post.author} created on ${new Date(post.date).toLocaleString()}</span>
                <button onclick="deletePost('${post.title}')">🗑️</button>
            `;
            postList.appendChild(listItem);
        });
    }

    // Add Blog Post
    blogForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const content = document.getElementById('content').value;

        const newPost = {
            title,
            author,
            content,
            date: new Date().toISOString()
        };

        fetch('/add-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPost)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Post added successfully');
                blogForm.reset();
                loadPosts(); // Reload posts after addition
            } else {
                alert('Error adding post');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error adding the post.');
        });
    });

    // Delete Blog Post
    window.deletePost = function(title) {
        if (confirm(`Are you sure you want to delete the post titled "${title}"?`)) {
            fetch(`/delete-post?title=${encodeURIComponent(title)}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Post deleted successfully');
                    loadPosts(); // Reload posts after deletion
                } else {
                    alert('Error deleting post');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error deleting the post.');
            });
        }
    };

    // Initial load
    loadPosts(); // Load posts on page load

    // Add event listeners for filtering and sorting
    titleFilter.addEventListener('input', filterPosts);
    authorFilter.addEventListener('change', filterPosts);
    sortOrder.addEventListener('change', filterPosts);
});
