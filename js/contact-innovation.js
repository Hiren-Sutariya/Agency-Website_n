/**
 * Contact INNOVATION JS - Advanced GSAP Effects
 * Magnetic buttons, Split character reveals, Parallax shards
 */

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP SplitText if it were available, but let's do manual splitting for compatibility
    initTextReveals();
    initMagneticElements();
    initParallaxShards();
    initFormEffects();
    initEnhancedCursor();
    initCountrySelector();
    initFormValidation();
});

function initCountrySelector() {
    const selectedFlag = document.getElementById('selected-flag');
    const selectedCode = document.getElementById('selected-code');
    const phoneInput = document.getElementById('phone-input');
    const countryOptions = document.querySelectorAll('.country-option');

    if (!selectedFlag || !selectedCode || !phoneInput) return;

    countryOptions.forEach(option => {
        option.addEventListener('click', () => {
            const flag = option.getAttribute('data-flag');
            const code = option.getAttribute('data-code');
            const placeholder = option.getAttribute('data-placeholder');

            if (flag && code) {
                // Update UI
                selectedFlag.textContent = flag;
                selectedCode.textContent = code;
                if (placeholder) phoneInput.placeholder = placeholder;

                // Feedback animation
                gsap.from([selectedFlag, selectedCode], {
                    y: -5,
                    opacity: 0,
                    duration: 0.3,
                    stagger: 0.05,
                    ease: 'back.out(2)'
                });
            }
        });
    });
}

function initFormValidation() {
    const phoneInput = document.getElementById('phone-input');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Allow only numbers, spaces, dashes, and parentheses
            const value = e.target.value;
            const cleaned = value.replace(/[^\d\s\-\(\)]/g, '');
            if (value !== cleaned) {
                e.target.value = cleaned;
                // Optional: visual feedback for blocked character
                gsap.to(phoneInput, { x: 5, duration: 0.1, repeat: 1, yoyo: true });
            }
        });
    }

    // Email validation logic
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const val = emailInput.value;
            if (val && !val.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                gsap.to(emailInput, { borderColor: 'rgba(255, 100, 100, 0.5)', x: 10, duration: 0.1, repeat: 1, yoyo: true });
            } else {
                emailInput.style.borderColor = '';
            }
        });
    }

    // Form Submission Success Handling
    const form = document.querySelector('form');
    const successMsg = document.getElementById('form-success');
    if (form && successMsg) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic animation to hide form
            gsap.to(form, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                onComplete: () => {
                    form.classList.add('hidden');
                    successMsg.classList.remove('hidden');

                    // Reveal success message
                    gsap.fromTo(successMsg,
                        { opacity: 0, scale: 0.9, y: 30 },
                        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }
                    );
                }
            });
        });
    }
}

function initTextReveals() {
    const splitTextElements = document.querySelectorAll('.split-text');
    splitTextElements.forEach(el => {
        const text = el.innerText;
        const chars = text.split('');
        el.innerHTML = '';
        chars.forEach((char) => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.className = 'char';
            el.appendChild(span);
        });

        gsap.from(el.querySelectorAll('.char'), {
            y: 50,
            opacity: 0,
            rotationX: -90,
            filter: 'blur(10px)',
            duration: 1,
            stagger: 0.03,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
            }
        });
    });

    // Staggered form field reveal - Refined for grid layout
    const formFields = document.querySelectorAll('.reveal-form [class*="animation-stagger-"]');
    if (formFields.length > 0) {
        gsap.from(formFields, {
            scrollTrigger: {
                trigger: '.reveal-form',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out'
        });
    }
}

function initMagneticElements() {
    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

function initParallaxShards() {
    const orb = document.getElementById('contact-orb');

    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;

        // Move Orb smoothly
        gsap.to(orb, {
            x: clientX - 300,
            y: clientY - 300,
            duration: 1.5,
            ease: 'power2.out'
        });
    });
}

function initEnhancedCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    // Add text container to cursor if it doesn't exist
    if (cursor && !cursor.querySelector('.cursor-text')) {
        const textWrapper = document.createElement('div');
        textWrapper.className = 'cursor-text';
        cursor.appendChild(textWrapper);
    }

    const interactiveElements = document.querySelectorAll('input, textarea, select, .magnetic, [data-cursor-label], .footer-link');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            let label = el.getAttribute('data-cursor-label');
            if (!label) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') label = 'WRITE';
                if (el.tagName === 'SELECT') label = 'CHOOSE';
                if (el.classList.contains('footer-link')) label = 'LINK';
            }

            if (label) {
                cursor.classList.add('active');
                cursor.querySelector('.cursor-text').innerText = label;
                gsap.to(cursor, {
                    width: 70,
                    height: 70,
                    duration: 0.3,
                    backgroundColor: 'rgba(133, 137, 227, 0.9)',
                    backdropFilter: 'blur(5px)'
                });
                gsap.to(follower, { opacity: 0, scale: 2.5, duration: 0.2 });
            }
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursor.querySelector('.cursor-text').innerText = '';
            gsap.to(cursor, {
                width: 10,
                height: 10,
                duration: 0.3,
                backgroundColor: 'white'
            });
            gsap.to(follower, { opacity: 1, scale: 1, duration: 0.2 });
        });
    });
}

function initFormEffects() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                backgroundColor: 'rgba(133, 137, 227, 0.08)',
                borderBottomColor: '#858AE3',
                duration: 0.4
            });
        });
        input.addEventListener('blur', () => {
            gsap.to(input, {
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderBottomColor: 'rgba(255, 255, 255, 0.1)',
                duration: 0.4
            });
        });
    });

    // Tilt effect for cards
    const cards = document.querySelectorAll('.glass');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    });
}
