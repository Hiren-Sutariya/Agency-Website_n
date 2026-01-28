// Main JS - Interactions & Responsiveness
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Creative Preloader Logic ('The Sarcastic AI')
    const statusText = document.getElementById('loader-status');
    const progressBar = document.getElementById('loader-progress');

    const messages = [
        "Locating more RAM...",
        "Bribing the servers...",
        "Preaching to the AI...",
        "Downloading pixels...",
        "Hiding the bugs...",
        "Polishing the ego...",
        "Almost there (maybe)...",
        "Wait, forgot the CSS...",
        "Okay, now definitely loading...",
        "Deploying vibes..."
    ];

    if (statusText && progressBar) {
        let count = 0;
        let messageIndex = 0;

        // Cycle funny messages
        const msgInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            const newMsg = messages[messageIndex];
            statusText.innerText = newMsg;
            statusText.setAttribute('data-text', newMsg);
        }, 1800);

        // Progress bar simulation with "Salty" logic
        const progressInterval = setInterval(() => {
            // Randomly "stutter" or jump back 1% for humor
            const step = Math.random() > 0.8 ? -1 : Math.floor(Math.random() * 4) + 1;
            count += step;

            if (count > 100) count = 100;
            if (count < 0) count = 0;

            progressBar.style.width = count + '%';

            if (count === 100) {
                clearInterval(progressInterval);
                clearInterval(msgInterval);
                statusText.innerText = "FINALLY DONE.";
                statusText.setAttribute('data-text', "FINALLY DONE.");

                setTimeout(() => {
                    document.body.classList.add('loaded');
                }, 1000);
            }
        }, 60);
    }

    // Scroll to top on load to ensure refresh starts at top
    window.scrollTo(0, 0);

    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    // Smooth dual cursor
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
        gsap.to(follower, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.3 });
    });

    // Intersection Observer for Luxury Reveals - Ensure fonts show
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Auto-scrolling Services Container
    const servicesContainer = document.getElementById('services-container');
    if (servicesContainer) {
        let scrollAmount = 0;
        let isHovered = false;

        servicesContainer.addEventListener('mouseenter', () => isHovered = true);
        servicesContainer.addEventListener('mouseleave', () => isHovered = false);

        function autoScroll() {
            if (!isHovered) {
                scrollAmount += 1; // Speed of auto-scroll
                if (scrollAmount >= servicesContainer.scrollWidth - servicesContainer.clientWidth) {
                    scrollAmount = 0;
                }
                servicesContainer.scrollLeft = scrollAmount;
            }
            requestAnimationFrame(autoScroll);
        }
        autoScroll();

        // Manual wheel interaction (Smooth override)
        servicesContainer.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                servicesContainer.scrollLeft += e.deltaY;
                scrollAmount = servicesContainer.scrollLeft; // Sync auto-scroll after manual
            }
        }, { passive: false });
    }
    // Mega Menu Interaction & Animation
    const megaGroups = document.querySelectorAll('.mega-group');
    const megaMenu = document.querySelector('.mega-menu');
    const servicesTrigger = document.querySelector('.nav-item-services');

    if (megaGroups.length > 0) {
        megaGroups.forEach(group => {
            const header = group.querySelector('.group-header');

            header.addEventListener('mouseenter', () => {
                // Deactivate all other groups
                megaGroups.forEach(g => {
                    g.classList.remove('active');
                    const gIcon = g.querySelector('.group-icon');
                    if (gIcon) gIcon.innerText = '+';
                });

                // Activate current group
                group.classList.add('active');
                const icon = group.querySelector('.group-icon');
                if (icon) icon.innerText = '−';

                // GSAP animation for sub-items
                const subItems = group.querySelectorAll('.mega-sub-item');
                if (subItems.length > 0) {
                    gsap.fromTo(subItems,
                        { opacity: 0, x: -15, filter: 'blur(5px)' },
                        { opacity: 1, x: 0, filter: 'blur(0px)', stagger: 0.04, duration: 0.5, ease: "power3.out" }
                    );
                }
            });
        });
    }

    // GSAP for Mega Menu Reveal
    if (servicesTrigger && megaMenu) {
        servicesTrigger.addEventListener('mouseenter', () => {
            gsap.fromTo(megaMenu,
                { opacity: 0, y: 30, pointerEvents: 'none', scale: 0.98 },
                { opacity: 1, y: 0, pointerEvents: 'auto', scale: 1, duration: 0.7, ease: "expo.out" }
            );

            // Stagger groups entrance
            gsap.fromTo('.mega-group',
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, stagger: 0.03, duration: 0.8, ease: "expo.out", delay: 0.1 }
            );
        });

        servicesTrigger.addEventListener('mouseleave', () => {
            gsap.to(megaMenu, { opacity: 0, y: 15, scale: 0.98, pointerEvents: 'none', duration: 0.4, ease: "power2.inOut" });
        });
    }

    // Mobile Hamburger Logic
    const hamburger = document.querySelector('.hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('overflow-hidden'); // Prevent scrolling when menu open
        });

        // Close menu when link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('overflow-hidden');
            });
        });
    }
});
