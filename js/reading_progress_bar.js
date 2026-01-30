// Reading progress bar
document.addEventListener('scroll', () => {
    const article = document.getElementById('storyContent');
    const progressBar = document.getElementById('readingProgress');
    const nav = document.getElementById('postNav');

    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    // Calculate progress
    const start = articleTop - windowHeight;
    const end = articleTop + articleHeight - windowHeight;
    const progress = Math.min(Math.max((scrollY - start) / (end - start) * 100, 0), 100);

    progressBar.style.width = progress + '%';

    // Nav scroll state
    if (scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Share functions
function shareTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Dalia's Tale - A powerful short story by Arthur Raines");
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
    });
}