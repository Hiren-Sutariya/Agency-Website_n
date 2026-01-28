// Animations JS - GSAP ScrollTrigger

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Standard Reveal Animations (Fade Up)
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((element) => {
        gsap.to(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: element.classList.contains('reveal-fast') ? 0.8 : 1.2,
            stagger: element.classList.contains('reveal-stagger') ? 0.15 : 0,
            ease: 'power3.out'
        });
    });

    // 1b. Staggered Children Reveal
    const staggeredParents = document.querySelectorAll('.reveal-staggered-children');
    staggeredParents.forEach((parent) => {
        gsap.from(parent.children, {
            scrollTrigger: {
                trigger: parent,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out'
        });
    });

    // 2. Hero Background Animation (Parallax)
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        gsap.to(heroBg, {
            scrollTrigger: {
                trigger: 'section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            scale: 1.2,
            y: 100
        });
    }

    // 3. Glow Animation
    const heroGlow = document.querySelector('.hero-glow');
    if (heroGlow) {
        gsap.to(heroGlow, {
            duration: 8,
            scale: 1.2,
            opacity: 0.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    // Unified Contact Form stagger now handled in contact-innovation.js

    // 4. Case Study Image Parallax
    const caseStudyImages = document.querySelectorAll('.case-study-img');
    caseStudyImages.forEach((img) => {
        const speed = img.getAttribute('data-parallax') || 0.1;
        gsap.to(img, {
            scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            y: -100 * speed,
            ease: 'none'
        });
    });

    // 5. Unique Case Studies Staggered Tilt Reveal
    const caseCards = document.querySelectorAll('.case-card');
    if (caseCards.length > 0) {
        gsap.from(caseCards, {
            scrollTrigger: {
                trigger: '.case-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 100,
            rotationX: 15,
            opacity: 0,
            duration: 1.5,
            stagger: 0.2,
            ease: 'expo.out'
        });
    }
    // 6. Testimonial Infinite Marquee Refined
    const setupMarquee = (selector, direction = 1, speed = 40) => {
        const track = document.querySelector(selector);
        if (!track) return;

        // Clone items for a seamless loop if needed
        const items = Array.from(track.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });

        const totalWidth = track.scrollWidth;
        const animation = gsap.to(track, {
            x: direction > 0 ? -totalWidth / 2 : 0,
            duration: speed,
            ease: 'none',
            repeat: -1,
            onReverseComplete: () => {
                animation.totalProgress(0.5);
            }
        });

        if (direction < 0) {
            gsap.set(track, { x: -totalWidth / 2 });
            gsap.to(track, {
                x: 0,
                duration: speed,
                ease: 'none',
                repeat: -1
            });
        }

        track.addEventListener('mouseenter', () => animation.pause());
        track.addEventListener('mouseleave', () => animation.play());
    };

    setupMarquee('.track-1', 1, 60);
    setupMarquee('.track-2', -1, 70);
});
