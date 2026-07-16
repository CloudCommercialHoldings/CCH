// Blog API Integration
class BlogAPI {
  constructor() {
    // Configure your blog site URL - update this with your actual blog URL
    // For development, use your Jekyll blog's local URL
    // For production, use your hosted blog URL
    this.BLOG_BASE_URL = 'http://localhost:4000'; // Change this to your blog's URL when hosted
    this.API_ENDPOINT = `${this.BLOG_BASE_URL}/api/posts.json`;
    this.BLOG_POST_BASE_URL = `${this.BLOG_BASE_URL}`;
  }

  async fetchBlogPosts() {
    try {
      console.log('Fetching blog posts from:', this.API_ENDPOINT);
      
      const response = await fetch(this.API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // Add CORS handling
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const posts = await response.json();
      console.log('Fetched blog posts:', posts);
      
      return posts;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      
      // Return mock data for development if API fails
      if (error.message.includes('fetch')) {
        console.log('Using fallback mock data for development');
        return this.getMockPosts();
      }
      
      throw error;
    }
  }

  getMockPosts() {
    return [
      {
        title: "Getting Started with Cloud Migration",
        excerpt: "Learn the essential steps for successfully migrating your infrastructure to the cloud. This comprehensive guide covers planning, execution, and best practices for a smooth transition.",
        date: "December 15, 2024",
        url: "/2024/12/15/cloud-migration-guide",
        categories: ["Cloud", "Migration"],
        tags: ["AWS", "Azure", "Cloud Strategy"],
        author: "Cloud Commercial Holdings",
        image: "/assets/images/cloud-migration.jpg"
      },
      {
        title: "Zero Trust Security Architecture",
        excerpt: "Implementing Zero Trust principles in modern enterprise environments. Discover how to secure your organization with identity-based security controls and continuous verification.",
        date: "December 10, 2024",
        url: "/2024/12/10/zero-trust-security",
        categories: ["Security", "Architecture"],
        tags: ["Zero Trust", "Cybersecurity", "IAM"],
        author: "Jeff Kessie",
        image: "/assets/images/zero-trust.jpg"
      },
      {
        title: "Automation Solutions for DevOps",
        excerpt: "Streamline your development and operations workflows with modern automation tools. Learn about Infrastructure as Code, CI/CD pipelines, and automated testing strategies.",
        date: "December 5, 2024",
        url: "/2024/12/05/devops-automation",
        categories: ["DevOps", "Automation"],
        tags: ["CloudFormation", "Pulumi", "CI/CD"],
        author: "Cloud Commercial Holdings",
        image: "/assets/images/devops-automation.jpg"
      }
    ];
  }

  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  }

  createBlogTile(post) {
    const tile = document.createElement('a');
    tile.className = 'blog-tile';
    tile.href = `${this.BLOG_POST_BASE_URL}${post.url}`;
    tile.target = '_blank';
    tile.rel = 'noopener noreferrer';

    // Extract first few words for preview
    const excerpt = post.excerpt || 'Read this insightful post...';
    const truncatedExcerpt = excerpt.length > 150 ? 
      excerpt.substring(0, 150) + '...' : excerpt;

    // Create tags HTML
    const tagsHTML = post.tags && post.tags.length > 0 ? 
      post.tags.slice(0, 3).map(tag => `<span class="blog-tag">${tag}</span>`).join('') : '';

    tile.innerHTML = `
      <div class="external-link" title="Opens in new tab">↗</div>
      
      <div class="blog-tile-image placeholder">
        <i class="fas fa-cloud"></i>
      </div>
      
      <div class="blog-tile-content">
        <div class="blog-tile-meta">
          <span class="blog-tile-date">
            <i class="fas fa-calendar-alt"></i> ${this.formatDate(post.date)}
          </span>
          <span class="blog-tile-author">
            <i class="fas fa-user"></i> ${post.author}
          </span>
        </div>
        
        <h3 class="blog-tile-title">${post.title}</h3>
        <p class="blog-tile-excerpt">${truncatedExcerpt}</p>
        
        ${tagsHTML ? `<div class="blog-tile-tags">${tagsHTML}</div>` : ''}
      </div>
      
      <div class="blog-tile-footer">
        <span class="read-more">Read Full Article</span>
      </div>
    `;

    return tile;
  }

  showLoadingState() {
    const blogGrid = document.getElementById('blog-grid');
    const loadingState = document.getElementById('blog-loading');
    const errorState = document.getElementById('blog-error');
    
    blogGrid.style.display = 'none';
    errorState.style.display = 'none';
    loadingState.style.display = 'block';
  }

  showErrorState() {
    const blogGrid = document.getElementById('blog-grid');
    const loadingState = document.getElementById('blog-loading');
    const errorState = document.getElementById('blog-error');
    
    blogGrid.style.display = 'none';
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
  }

  showBlogGrid() {
    const blogGrid = document.getElementById('blog-grid');
    const loadingState = document.getElementById('blog-loading');
    const errorState = document.getElementById('blog-error');
    
    loadingState.style.display = 'none';
    errorState.style.display = 'none';
    blogGrid.style.display = 'grid';
  }

  renderBlogPosts(posts) {
    const blogGrid = document.getElementById('blog-grid');
    
    if (!posts || posts.length === 0) {
      blogGrid.innerHTML = `
        <div class="empty-state">
          <h3>No Blog Posts Yet</h3>
          <p>Check back soon for insights on cloud technology and digital transformation!</p>
        </div>
      `;
      this.showBlogGrid();
      return;
    }

    // Clear existing content
    blogGrid.innerHTML = '';

    // Create tiles for each post
    posts.forEach(post => {
      const tile = this.createBlogTile(post);
      blogGrid.appendChild(tile);
    });

    // Add floating clouds to the grid area
    this.addFloatingClouds();

    this.showBlogGrid();
  }

  addFloatingClouds() {
    const blogSection = document.querySelector('.blog-section');
    
    // Create additional floating clouds
    for (let i = 1; i <= 3; i++) {
      const cloud = document.createElement('div');
      cloud.className = `floating-cloud floating-cloud-${i}`;
      cloud.innerHTML = '<img src="/static/cloud-shape.svg" alt="">';
      blogSection.appendChild(cloud);
    }
  }

  async loadBlogPosts() {
    this.showLoadingState();
    
    try {
      const posts = await this.fetchBlogPosts();
      this.renderBlogPosts(posts);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
      this.showErrorState();
    }
  }
}

// Initialize blog API when page loads
const blogAPI = new BlogAPI();

// Load blog posts when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Only load if we're on the blog page
  if (document.getElementById('blog-grid')) {
    blogAPI.loadBlogPosts();
  }
});

// Global function for retry button
function loadBlogPosts() {
  blogAPI.loadBlogPosts();
}

// Add some Font Awesome icons if not already included
if (!document.querySelector('link[href*="font-awesome"]')) {
  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
  document.head.appendChild(fontAwesome);
}
