document.addEventListener('DOMContentLoaded', () => {
    const blogContainer = document.getElementById('blog-container');
    const titleFilter = document.getElementById('title-filter');
    const authorFilter = document.getElementById('author-filter');
    const sortOrder = document.getElementById('sort-order');

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
                renderPosts(posts);
                populateAuthorFilter(posts);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                blogContainer.innerHTML = '<p>Sorry, there was an error loading the blog posts.</p>';
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

    function renderPosts(filteredPosts) {
        blogContainer.innerHTML = '';
        filteredPosts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.classList.add('blog-post');
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p><strong>Author:</strong> ${post.author} | <strong>Date:</strong> ${new Date(post.date).toLocaleString()}</p>
                <p>${post.content}</p>
            `;
            blogContainer.appendChild(postElement);
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

        console.log('Before Sorting:', filteredPosts);

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

        console.log('After Sorting:', filteredPosts);

        renderPosts(filteredPosts);
    }

    // Initial load
    loadPosts(); // Load posts on page load

    // Add event listeners for filtering and sorting
    titleFilter.addEventListener('input', filterPosts);
    authorFilter.addEventListener('change', filterPosts);
    sortOrder.addEventListener('change', filterPosts);

});