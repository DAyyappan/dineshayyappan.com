const postList = document.getElementById('post-list');
const converter = new showdown.Converter();

async function loadPosts() {
    const response = await fetch('posts.json');
    const data = await response.json();
    
    data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    data.posts.forEach(post => {
        if (post.published) {
            const postElement = createPostElement(post);
            postList.appendChild(postElement);
        }
    });
}

function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'post-summary';
    
    const title = document.createElement('h2');
    const titleLink = document.createElement('a');
    titleLink.href = `post.html?id=${post.id}`;
    titleLink.textContent = post.title;
    title.appendChild(titleLink);
    
    const date = document.createElement('p');
    date.className = 'post-date';
    date.textContent = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const metaInfo = document.createElement('div');
    metaInfo.className = 'post-meta';
    
    if (post.categories && post.categories.length > 0) {
        const categories = document.createElement('span');
        categories.className = 'post-categories';
        categories.textContent = `Categories: ${post.categories.join(', ')}`;
        metaInfo.appendChild(categories);
    }
    
    if (post.tags && post.tags.length > 0) {
        const tags = document.createElement('span');
        tags.className = 'post-tags';
        tags.textContent = `Tags: ${post.tags.join(', ')}`;
        metaInfo.appendChild(tags);
    }
    
    const excerpt = document.createElement('p');
    excerpt.className = 'post-excerpt';
    excerpt.textContent = generateExcerpt(post.content);
    
    const readMore = document.createElement('a');
    readMore.href = `post.html?id=${post.id}`;
    readMore.textContent = 'Read more';
    readMore.className = 'read-more';
    
    article.appendChild(title);
    article.appendChild(date);
    article.appendChild(metaInfo);
    article.appendChild(excerpt);
    article.appendChild(readMore);
    
    return article;
}

function generateExcerpt(content, maxLength = 200) {
    let plainText = content.replace(/\[.*?\]\(.*?\)/g, '').replace(/[*#_~`]/g, '');
    if (plainText.length > maxLength) {
        plainText = plainText.substr(0, maxLength);
        plainText = plainText.substr(0, Math.min(plainText.length, plainText.lastIndexOf(" ")));
        plainText += "...";
    }
    return plainText;
}

loadPosts();