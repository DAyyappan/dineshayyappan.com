const postContent = document.getElementById('post-content');
const converter = new showdown.Converter();

async function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) {
        postContent.innerHTML = '<p>Post not found</p>';
        return;
    }
    
    try {
        const response = await fetch('posts.json');
        const data = await response.json();
        const post = data.posts.find(p => p.id === postId);
        
        if (!post) {
            postContent.innerHTML = '<p>Post not found</p>';
            return;
        }
        
        document.title = `${post.title} - Your Name`;
        
        const postElement = document.createElement('article');
        postElement.className = 'single-post';
        
        const title = document.createElement('h1');
        title.textContent = post.title;
        
        const date = document.createElement('p');
        date.className = 'post-meta';
        date.textContent = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        const content = document.createElement('div');
        content.className = 'post-content';
        content.innerHTML = converter.makeHtml(post.content);
        
        postElement.appendChild(title);
        postElement.appendChild(date);
        postElement.appendChild(content);
        
        if (post.comments && post.comments.length > 0) {
            const commentsSection = createCommentsSection(post.comments);
            postElement.appendChild(commentsSection);
        }
        
        postContent.appendChild(postElement);
        
        // Adjust image sizes
        const images = postContent.getElementsByTagName('img');
        for (let img of images) {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        }
        
    } catch (error) {
        console.error('Error loading post:', error);
        postContent.innerHTML = '<p>Error loading post</p>';
    }
}

function createCommentsSection(comments) {
    const section = document.createElement('section');
    section.className = 'comments-section';
    
    const heading = document.createElement('h3');
    heading.textContent = 'Comments';
    section.appendChild(heading);
    
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        
        const author = document.createElement('p');
        author.className = 'comment-author';
        author.textContent = comment.author;
        
        const date = document.createElement('p');
        date.className = 'comment-date';
        date.textContent = new Date(comment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        const content = document.createElement('div');
        content.className = 'comment-content';
        content.innerHTML = comment.content;
        
        commentElement.appendChild(author);
        commentElement.appendChild(date);
        commentElement.appendChild(content);
        
        section.appendChild(commentElement);
    });
    
    return section;
}

loadPost();