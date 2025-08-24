// Global state management
let projects = JSON.parse(localStorage.getItem('hackathon_projects')) || [];
let userVotes = JSON.parse(localStorage.getItem('user_votes')) || [];
let deviceId = localStorage.getItem('device_id') || generateDeviceId();
let currentFilter = 'all';

// Generate unique device ID
function generateDeviceId() {
    const id = 'device_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem('device_id', id);
    return id;
}

// DOM elements
const submitBtn = document.getElementById('submitBtn');
const submissionModal = document.getElementById('submissionModal');
const successModal = document.getElementById('successModal');
const voteModal = document.getElementById('voteModal');
const closeBtn = document.getElementById('closeBtn');
const submissionForm = document.getElementById('submissionForm');
const projectsGrid = document.getElementById('projectsGrid');
const emptyState = document.getElementById('emptyState');
const projectImage = document.getElementById('projectImage');
const imagePreview = document.getElementById('imagePreview');
const heartRainContainer = document.getElementById('heartRainContainer');

// Statistics elements
const totalProjectsEl = document.getElementById('totalProjects');
const totalVotesEl = document.getElementById('totalVotes');
const mostVotedProjectEl = document.getElementById('mostVotedProject');
const mostVotedCountEl = document.getElementById('mostVotedCount');
const userVoteCountEl = document.getElementById('userVoteCount');
const projectCountEl = document.getElementById('projectCount');
const photoCountEl = document.getElementById('photoCount');
const videoCountEl = document.getElementById('videoCount');

// Filter buttons
const filterButtons = document.querySelectorAll('.filter-btn');

// Event listeners
submitBtn.addEventListener('click', openSubmissionModal);
closeBtn.addEventListener('click', closeSubmissionModal);
submissionForm.addEventListener('submit', handleSubmission);
projectImage.addEventListener('input', handleImagePreview);

// Filter event listeners
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        setActiveFilter(btn, category);
        filterProjects(category);
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === submissionModal) {
        closeSubmissionModal();
    }
    if (e.target === successModal) {
        closeSuccessModal();
    }
    if (e.target === voteModal) {
        closeVoteModal();
    }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    updateStatistics();
});

// Heart Rain Animation
function createHeartRain() {
    const heartsCount = 15;
    
    for (let i = 0; i < heartsCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            heartRainContainer.appendChild(heart);
            
            // Remove heart after animation
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 4000);
        }, i * 100);
    }
}

// Modal functions
function openSubmissionModal() {
    submissionModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeSubmissionModal() {
    submissionModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    submissionForm.reset();
    imagePreview.style.display = 'none';
}

function closeSuccessModal() {
    successModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeVoteModal() {
    voteModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Filter functions
function setActiveFilter(activeBtn, category) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
    currentFilter = category;
}

function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        if (category === 'all') {
            card.classList.remove('hidden');
        } else {
            const projectCategory = card.dataset.category;
            if (projectCategory === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        }
    });
    
    // Check if any projects are visible
    const visibleProjects = document.querySelectorAll('.project-card:not(.hidden)');
    if (visibleProjects.length === 0) {
        emptyState.style.display = 'block';
        projectsGrid.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        projectsGrid.style.display = 'grid';
    }
}

// Image preview function
function handleImagePreview() {
    const url = projectImage.value;
    if (url) {
        imagePreview.innerHTML = `<img src="${url}" alt="Preview" onerror="this.parentElement.style.display='none'">`;
        imagePreview.style.display = 'block';
    } else {
        imagePreview.style.display = 'none';
    }
}

// Form submission handler
async function handleSubmission(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalContent = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<div class="loading"></div> Submitting...';
    submitButton.disabled = true;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const project = {
        id: Date.now().toString(),
        title: document.getElementById('projectTitle').value,
        teamName: document.getElementById('teamName').value,
        description: document.getElementById('projectDescription').value,
        imageUrl: document.getElementById('projectImage').value,
        demoUrl: document.getElementById('demoUrl').value,
        githubUrl: document.getElementById('githubUrl').value,
        category: document.getElementById('projectCategory').value,
        votes: 0,
        submittedAt: new Date().toISOString(),
        votedBy: []
    };
    
    projects.push(project);
    saveProjects();
    renderProjects();
    updateStatistics();
    
    // Reset form and button
    submitButton.innerHTML = originalContent;
    submitButton.disabled = false;
    
    closeSubmissionModal();
    
    // Show success modal
    successModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Save projects to localStorage
function saveProjects() {
    localStorage.setItem('hackathon_projects', JSON.stringify(projects));
}

// Save user votes to localStorage
function saveUserVotes() {
    localStorage.setItem('user_votes', JSON.stringify(userVotes));
}

// Get category display name
function getCategoryDisplayName(category) {
    const categoryNames = {
        'project': 'Project Upload',
        'photo': 'Photo Generation',
        'video': 'Video Generation'
    };
    return categoryNames[category] || category;
}

// Get category icon
function getCategoryIcon(category) {
    const categoryIcons = {
        'project': 'fas fa-laptop-code',
        'photo': 'fas fa-camera',
        'video': 'fas fa-video'
    };
    return categoryIcons[category] || 'fas fa-code';
}

// Render projects to the grid
function renderProjects() {
    if (projects.length === 0) {
        projectsGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    projectsGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    projectsGrid.innerHTML = projects.map(project => createProjectCard(project)).join('');
    
    // Apply current filter
    filterProjects(currentFilter);
}

// Create project card HTML
function createProjectCard(project) {
    const hasVoted = userVotes.includes(project.id);
    const isVotedByDevice = project.votedBy && project.votedBy.includes(deviceId);
    
    return `
        <div class="project-card fade-in" data-category="${project.category}">
            <div class="category-badge ${project.category}">
                <i class="${getCategoryIcon(project.category)}"></i>
                ${getCategoryDisplayName(project.category)}
            </div>
            <img src="${project.imageUrl}" alt="${project.title}" class="project-image" onerror="this.src='https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg'">
            <div class="project-content">
                <h4 class="project-title">${project.title}</h4>
                <div class="project-team">
                    <i class="fas fa-users"></i>
                    ${project.teamName}
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-meta">
                    <span><i class="fas fa-calendar"></i> ${new Date(project.submittedAt).toLocaleDateString()}</span>
                </div>
                <div class="project-actions">
                    <button 
                        class="vote-btn ${isVotedByDevice ? 'voted' : ''}" 
                        onclick="handleVote('${project.id}')" 
                        ${isVotedByDevice ? 'disabled' : ''}
                    >
                        <i class="fas fa-heart"></i>
                        ${isVotedByDevice ? 'Voted' : 'Vote'}
                    </button>
                    <div class="vote-count">
                        <i class="fas fa-heart"></i>
                        <span>${project.votes}</span>
                    </div>
                </div>
                ${(project.demoUrl || project.githubUrl) ? `
                    <div class="project-links">
                        ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                        ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-link"><i class="fab fa-github"></i> GitHub</a>` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Handle voting
async function handleVote(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Check if device has already voted for this project
    if (project.votedBy && project.votedBy.includes(deviceId)) {
        alert('You have already voted for this project!');
        return;
    }
    
    // Initialize votedBy array if it doesn't exist
    if (!project.votedBy) {
        project.votedBy = [];
    }
    
    // Add vote
    project.votes++;
    project.votedBy.push(deviceId);
    
    // Add to user votes
    if (!userVotes.includes(projectId)) {
        userVotes.push(projectId);
    }
    
    // Save changes
    saveProjects();
    saveUserVotes();
    
    // Create heart rain animation
    createHeartRain();
    
    // Add voting animation to button
    const voteButton = event.target.closest('.vote-btn');
    voteButton.classList.add('voting');
    setTimeout(() => voteButton.classList.remove('voting'), 600);
    
    // Re-render projects and update statistics
    renderProjects();
    updateStatistics();
    
    // Show vote confirmation after a short delay
    setTimeout(() => {
        voteModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }, 800);
}

// Update statistics
function updateStatistics() {
    const totalProjects = projects.length;
    const totalVotes = projects.reduce((sum, project) => sum + project.votes, 0);
    const userVoteCount = userVotes.length;
    
    // Category counts
    const projectCount = projects.filter(p => p.category === 'project').length;
    const photoCount = projects.filter(p => p.category === 'photo').length;
    const videoCount = projects.filter(p => p.category === 'video').length;
    
    // Find most voted project
    let mostVotedProject = null;
    let mostVotedCount = 0;
    
    projects.forEach(project => {
        if (project.votes > mostVotedCount) {
            mostVotedCount = project.votes;
            mostVotedProject = project;
        }
    });
    
    // Update DOM elements
    totalProjectsEl.textContent = totalProjects;
    totalVotesEl.textContent = totalVotes;
    userVoteCountEl.textContent = userVoteCount;
    projectCountEl.textContent = projectCount;
    photoCountEl.textContent = photoCount;
    videoCountEl.textContent = videoCount;
    
    if (mostVotedProject) {
        mostVotedProjectEl.textContent = mostVotedProject.title;
        mostVotedCountEl.textContent = mostVotedCount;
    } else {
        mostVotedProjectEl.textContent = 'No projects yet';
        mostVotedCountEl.textContent = '0';
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some sample projects for demonstration
function addSampleProjects() {
    const sampleProjects = [
        {
            id: 'sample1',
            title: 'EcoTracker App',
            teamName: 'Green Coders',
            description: 'A comprehensive mobile application that helps users track their carbon footprint and suggests eco-friendly alternatives for daily activities.',
            imageUrl: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg',
            demoUrl: 'https://ecotracker-demo.com',
            githubUrl: 'https://github.com/greencoders/ecotracker',
            category: 'project',
            votes: 15,
            submittedAt: new Date(Date.now() - 86400000).toISOString(),
            votedBy: []
        },
        {
            id: 'sample2',
            title: 'AI Portrait Generator',
            teamName: 'Vision Labs',
            description: 'An advanced AI-powered tool that generates stunning professional portraits from simple sketches or descriptions using cutting-edge machine learning.',
            imageUrl: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg',
            demoUrl: 'https://ai-portrait-gen.com',
            githubUrl: 'https://github.com/visionlabs/portrait-ai',
            category: 'photo',
            votes: 23,
            submittedAt: new Date(Date.now() - 172800000).toISOString(),
            votedBy: []
        },
        {
            id: 'sample3',
            title: 'AutoEdit Pro',
            teamName: 'Media Innovators',
            description: 'Revolutionary video editing platform that uses AI to automatically edit raw footage into professional-quality videos with music, transitions, and effects.',
            imageUrl: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg',
            demoUrl: 'https://autoedit-pro.com',
            githubUrl: 'https://github.com/mediainnovators/autoedit',
            category: 'video',
            votes: 31,
            submittedAt: new Date(Date.now() - 259200000).toISOString(),
            votedBy: []
        },
        {
            id: 'sample4',
            title: 'StudyBuddy AI',
            teamName: 'Learning Labs',
            description: 'An intelligent study companion that creates personalized learning paths, provides instant feedback, and adapts to individual learning styles.',
            imageUrl: 'https://images.pexels.com/photos/5965592/pexels-photo-5965592.jpeg',
            demoUrl: 'https://studybuddy-ai.com',
            githubUrl: 'https://github.com/learninglabs/studybuddy',
            category: 'project',
            votes: 18,
            submittedAt: new Date(Date.now() - 345600000).toISOString(),
            votedBy: []
        },
        {
            id: 'sample5',
            title: 'DreamScape Creator',
            teamName: 'Pixel Dreamers',
            description: 'Transform your wildest imagination into stunning visual art. This AI generates breathtaking landscapes and fantasy scenes from text descriptions.',
            imageUrl: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg',
            demoUrl: 'https://dreamscape-creator.com',
            githubUrl: 'https://github.com/pixeldreamers/dreamscape',
            category: 'photo',
            votes: 27,
            submittedAt: new Date(Date.now() - 432000000).toISOString(),
            votedBy: []
        },
        {
            id: 'sample6',
            title: 'CineMagic AI',
            teamName: 'Film Tech Studios',
            description: 'Create Hollywood-quality movie trailers and short films automatically. Input your script and watch AI bring your story to life with stunning visuals.',
            imageUrl: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
            demoUrl: 'https://cinemagic-ai.com',
            githubUrl: 'https://github.com/filmtech/cinemagic',
            category: 'video',
            votes: 35,
            submittedAt: new Date(Date.now() - 518400000).toISOString(),
            votedBy: []
        }
    ];
    
    // Only add sample projects if no projects exist
    if (projects.length === 0) {
        projects = sampleProjects;
        saveProjects();
        renderProjects();
        updateStatistics();
    }
}

// Initialize sample projects for demo purposes
addSampleProjects();

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (submissionModal.style.display === 'block') {
            closeSubmissionModal();
        }
        if (successModal.style.display === 'block') {
            closeSuccessModal();
        }
        if (e.target === voteModal) {
            closeVoteModal();
        }
    }
});

// Add animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.project-card, .stats-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });
    
    elements.forEach((el) => observer.observe(el));
}

// Initialize animations
document.addEventListener('DOMContentLoaded', animateOnScroll);

// Export/Import functionality for data backup
function exportData() {
    const data = {
        projects: projects,
        votes: userVotes,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'hackathon_data.json';
    link.click();
}

// Add data management functions to window for console access
window.hackathonVoting = {
    exportData,
    clearAllData: () => {
        localStorage.removeItem('hackathon_projects');
        localStorage.removeItem('user_votes');
        projects = [];
        userVotes = [];
        renderProjects();
        updateStatistics();
        console.log('All data cleared');
    },
    getStats: () => ({
        totalProjects: projects.length,
        totalVotes: projects.reduce((sum, p) => sum + p.votes, 0),
        userVotes: userVotes.length,
        deviceId: deviceId,
        categoryBreakdown: {
            project: projects.filter(p => p.category === 'project').length,
            photo: projects.filter(p => p.category === 'photo').length,
            video: projects.filter(p => p.category === 'video').length
        }
    }),
    triggerHeartRain: createHeartRain
};

console.log('🚀 Enhanced Hackathon Voting System initialized!');
console.log('💡 Type hackathonVoting.getStats() to see statistics');
console.log('📊 Type hackathonVoting.exportData() to download data');
console.log('❤️ Type hackathonVoting.triggerHeartRain() to test heart rain animation');