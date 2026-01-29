class PhotoCarousel {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            autoplay: false,
            autoplayInterval: 6000,
            enableKeyboard: true,
            enableTouch: true,
            ...options
        };

        this.currentIndex = 0;
        this.isTransitioning = false;
        this.autoplayTimer = null;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.slides = this.container.querySelectorAll('.carousel-slide');
        this.thumbnails = this.container.querySelectorAll('.carousel-thumb');
        this.prevBtn = this.container.querySelector('.carousel-nav--prev');
        this.nextBtn = this.container.querySelector('.carousel-nav--next');
        this.counter = this.container.querySelector('.carousel-counter');
        this.progressBar = this.container.querySelector('.carousel-progress-bar');
        this.viewer = this.container.querySelector('.carousel-viewer');

        this.totalSlides = this.slides.length;

        if (this.totalSlides === 0) return;

        this.bindEvents();
        this.showSlide(0);

        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    bindEvents() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Thumbnail clicks
        this.thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => this.goTo(index));
            thumb.setAttribute('tabindex', '0');
            thumb.setAttribute('role', 'button');
            thumb.setAttribute('aria-label', `Go to slide ${index + 1}`);
            thumb.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goTo(index);
                }
            });
        });

        // Keyboard navigation
        if (this.options.enableKeyboard) {
            document.addEventListener('keydown', (e) => {
                // Only respond if carousel is in viewport
                if (!this.isInViewport()) return;

                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.prev();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.next();
                        break;
                }
            });
        }

        // Touch events
        if (this.options.enableTouch && this.viewer) {
            this.viewer.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            this.viewer.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });
        }

        // Pause autoplay on hover
        if (this.viewer && this.options.autoplay) {
            this.viewer.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.viewer.addEventListener('mouseleave', () => this.startAutoplay());
        }

        // Handle visibility change (pause when tab not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else if (this.options.autoplay) {
                this.startAutoplay();
            }
        });
    }

    isInViewport() {
        const rect = this.container.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom > 0
        );
    }

    handleSwipe() {
        const threshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }

    showSlide(index) {
        if (this.isTransitioning) return;

        // Handle wrapping
        if (index < 0) {
            index = this.totalSlides - 1;
        } else if (index >= this.totalSlides) {
            index = 0;
        }

        this.isTransitioning = true;

        // Update slides
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Update thumbnails
        this.thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
            thumb.setAttribute('aria-selected', i === index);
        });

        // Scroll active thumbnail into view
        if (this.thumbnails[index]) {
            this.thumbnails[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }

        // Update counter
        if (this.counter) {
            this.counter.textContent = `${index + 1} / ${this.totalSlides}`;
        }

        // Update progress bar
        if (this.progressBar) {
            const progress = ((index + 1) / this.totalSlides) * 100;
            this.progressBar.style.width = `${progress}%`;
        }

        this.currentIndex = index;

        // Reset transition lock after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800);
    }

    next() {
        this.showSlide(this.currentIndex + 1);
        this.resetAutoplay();
    }

    prev() {
        this.showSlide(this.currentIndex - 1);
        this.resetAutoplay();
    }

    goTo(index) {
        if (index !== this.currentIndex) {
            this.showSlide(index);
            this.resetAutoplay();
        }
    }

    startAutoplay() {
        if (this.autoplayTimer) return;
        this.autoplayTimer = setInterval(() => {
            this.next();
        }, this.options.autoplayInterval);
    }

    pauseAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }

    resetAutoplay() {
        if (this.options.autoplay) {
            this.pauseAutoplay();
            this.startAutoplay();
        }
    }
}

// Photo data - easy to extend with new images
const photoData = [
    {
        src: 'images/Maine_mountain_print.JPG',
        location: 'Acadia National Park, Maine',
        description: 'Pink granite cliffs meet the Atlantic along the rugged coast'
    },
    {
        src: 'images/Maine_river_print.JPG',
        location: 'Acadia National Park, Maine',
        description: 'Morning mist rising over a quiet inlet'
    },
    {
        src: 'images/DSC_3023.JPG',
        location: 'La Cienega, New Mexico',
        description: 'The open road stretching toward the Sangre de Cristo Mountains'
    },
    {
        src: 'images/IMG_1871.JPG',
        location: 'Yellowstone National Park',
        description: 'A bison herd taking over the road — a quintessential Yellowstone moment'
    },
    {
        src: 'images/IMG_1875.JPG',
        location: 'Lamar Valley, Wyoming',
        description: 'Bison grazing in the Serengeti of North America'
    },
    {
        src: 'images/IMG_1873.JPG',
        location: 'Yellowstone River',
        description: 'Bison by the river, framed by lodgepole pines'
    },
    {
        src: 'images/IMG_1868.JPG',
        location: 'Theodore Roosevelt National Park',
        description: 'A solitary bison in the North Dakota badlands'
    },
    {
        src: 'images/IMG_1874.JPG',
        location: 'Mammoth Hot Springs, Wyoming',
        description: 'Elk grazing against the dramatic backdrop of the Absaroka Range'
    },
    {
        src: 'images/IMG_1877.PNG',
        location: 'South Dakota Prairie',
        description: 'A curious prairie dog keeping watch'
    },
    {
        src: 'images/IMG_1876.JPG',
        location: 'Coastal Maine',
        description: 'Traditional rope pulleys on a classic sailing vessel'
    },
    {
        src: 'images/IMG_0224.jpeg',
        location: 'Evanston, Illinois',
        description: 'A moody evening along the rocky shore'
    },
    {
        src: 'images/66828128548__9768C9E2-44B6-49B5-A4CF-A664C4174201.jpeg',
        location: 'Hanover, New Hampshire',
        description: 'Portrait Series, Contrasting faces'
    },
    {
        src: 'images/66828129896__0711A675-623D-4833-A290-FDA7B21BCC8B.jpeg',
        location: 'Hanover, New Hampshire',
        description: 'Portrait Series, Profile in silhouette'
    },
    {
        src: 'images/66796520409__2FDC9BE9-05D2-48C5-AF71-5063AD9B12F0.jpeg',
        location: 'Hanover, New Hampshire',
        description: 'Portrait Series, Contemplation in monochrome'
    },
    {
        src: 'images/66745893492__E1473838-AFF3-430B-8A30-4947DBE3CD65.jpeg',
        location: 'Hanover, New Hampshire',
        description: 'Portrait Series, Close-up study'
    }
];

// Generate carousel HTML
function generateCarouselHTML(photos) {
    const slides = photos.map((photo, index) => `
        <div class="carousel-slide${index === 0 ? ' active' : ''}" data-index="${index}">
            <img src="${photo.src}" alt="${photo.location}" loading="${index < 3 ? 'eager' : 'lazy'}">
            <div class="slide-info">
                <div class="slide-location">
                    <span class="location-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                    </span>
                    <span>${photo.location}</span>
                </div>
                <p class="slide-description">${photo.description}</p>
            </div>
        </div>
    `).join('');

    const thumbnails = photos.map((photo, index) => `
        <div class="carousel-thumb${index === 0 ? ' active' : ''}" data-index="${index}">
            <img src="${photo.src}" alt="Thumbnail ${index + 1}" loading="lazy">
        </div>
    `).join('');

    return `
        <section class="photo-carousel-section" id="photo-gallery">
            <div class="carousel-header">
                <h2>Through My Lens</h2>
                <p>Moments captured</p>
            </div>
            
            <div class="carousel-container" id="photoCarousel">
                <div class="carousel-viewer">
                    <div class="carousel-slides">
                        ${slides}
                    </div>
                    
                    <button class="carousel-nav carousel-nav--prev" aria-label="Previous photo">
                        <svg viewBox="0 0 24 24">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    
                    <button class="carousel-nav carousel-nav--next" aria-label="Next photo">
                        <svg viewBox="0 0 24 24">
                            <polyline points="9 6 15 12 9 18"></polyline>
                        </svg>
                    </button>
                    
                    <div class="carousel-counter">1 / ${photos.length}</div>
                    
                    <div class="carousel-progress">
                        <div class="carousel-progress-bar"></div>
                    </div>
                </div>
                
                <div class="carousel-thumbnails">
                    ${thumbnails}
                </div>
                
                <p class="carousel-hint">
                    Use <kbd>←</kbd> <kbd>→</kbd> arrow keys to navigate
                </p>
            </div>
        </section>
    `;
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Find insertion point (before the CTA section)
    const ctaSection = document.querySelector('.cta-section');
    const mapSection = document.querySelector('.map-section');

    if (mapSection) {
        // Insert carousel HTML after map section
        mapSection.insertAdjacentHTML('afterend', generateCarouselHTML(photoData));

        // Initialize the carousel
        const carouselContainer = document.getElementById('photoCarousel');
        if (carouselContainer) {
            new PhotoCarousel(carouselContainer, {
                autoplay: false,
                enableKeyboard: true,
                enableTouch: true
            });
        }
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PhotoCarousel, photoData, generateCarouselHTML };
}