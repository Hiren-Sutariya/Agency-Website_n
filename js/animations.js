// Animations JS - GSAP ScrollTrigger

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Enhanced Reveal Animations (Fade Up + Stagger)
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((element) => {
        // If it's a heading, we might want to split it (simplified version here)
        const isText = ['H1', 'H2', 'H3', 'P'].includes(element.tagName);

        gsap.fromTo(element,
            {
                opacity: 0,
                y: 60,
                rotateX: isText ? 10 : 0
            },
            {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 1.5,
                ease: 'expo.out',
                clearProps: "all"
            }
        );
    });

    // 2. Hero Background Animation (Parallax)
    gsap.to('.hero-bg', {
        scrollTrigger: {
            trigger: 'section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        scale: 1.2,
        y: 100
    });

    // 3. Glow Animation
    gsap.to('.hero-glow', {
        duration: 8,
        scale: 1.2,
        opacity: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

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

        // Clone items multiple times for a seamless loop on large screens
        const items = Array.from(track.children);
        items.forEach(item => track.appendChild(item.cloneNode(true)));
        items.forEach(item => track.appendChild(item.cloneNode(true)));

        const totalWidth = track.scrollWidth;
        const singleSetWidth = totalWidth / 3; // Since we have 3 sets now

        if (direction === 1) {
            // Move Left: 0 -> -singleSetWidth
            gsap.fromTo(track,
                { x: 0 },
                { x: -singleSetWidth, duration: speed, ease: 'none', repeat: -1 }
            );
        } else {
            // Move Right: -singleSetWidth -> 0
            gsap.fromTo(track,
                { x: -singleSetWidth },
                { x: 0, duration: speed, ease: 'none', repeat: -1 }
            );
        }

        // Pause on hover
        track.addEventListener('mouseenter', () => gsap.getTweensOf(track).forEach(t => t.pause()));
        track.addEventListener('mouseleave', () => gsap.getTweensOf(track).forEach(t => t.play()));
    };

    // Initialize after window load to ensure images are ready for width sizing
    window.addEventListener('load', () => {
        // Kill old animations if any exist to prevent conflicts
        gsap.killTweensOf('.testimonial-track');
        gsap.killTweensOf('.team-track');

        setupMarquee('.track-1', 1, 60);
        setupMarquee('.track-2', -1, 70);
        setupMarquee('.team-track', 1, 60);
    });
});
