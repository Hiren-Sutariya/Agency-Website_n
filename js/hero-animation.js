// Dual Animation System: Hero & Scroll-Sync Morphing Services
// Optimized for 7 cards and true horizontal pinning.

let heroScene, heroCamera, heroRenderer, heroCloud;
let dockScene, dockCamera, dockRenderer, dockCloud;
let shapePositions = [];
let shapeColors = [];
let currentShape = 0;

// HELPER: Create Soft Glowing Dot Texture
function createSoftDotTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

// Premium Magnetic Dent Particle Sphere Animation (Revamped)
function initHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    heroScene = new THREE.Scene();
    heroCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Responsive Camera Position
    if (window.innerWidth < 768) {
        heroCamera.position.z = 32; // "Little big a small" - making it slightly smaller by moving camera back
    } else {
        heroCamera.position.z = 22; // Desktop standard
    }

    heroRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    heroRenderer.setSize(window.innerWidth, window.innerHeight);

    // --- High Density Premium Sphere ---
    const count = 15000; // Reference-matched high density
    const radius = 6.2; // Optimized for hero presence
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // Uniform Fibonacci Distribution
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        originalPositions[i3] = x;
        originalPositions[i3 + 1] = y;
        originalPositions[i3 + 2] = z;

        colors[i3] = 1.0;
        colors[i3 + 1] = 1.0;
        colors[i3 + 2] = 1.0;

        sizes[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 0.065, // Increased size for more presence
        map: createSoftDotTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 1.0, // Maximum opacity
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    heroCloud = new THREE.Points(geometry, material);
    heroScene.add(heroCloud);

    // Add ambient floating particles (Reference-matched)
    const ambientCount = 100;
    const ambientGeometry = new THREE.BufferGeometry();
    const ambientPositions = new Float32Array(ambientCount * 3);
    for (let i = 0; i < ambientCount; i++) {
        ambientPositions[i * 3] = (Math.random() - 0.5) * 40;
        ambientPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        ambientPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    ambientGeometry.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));
    const ambientMaterial = new THREE.PointsMaterial({
        size: 0.12,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const ambientPoints = new THREE.Points(ambientGeometry, ambientMaterial);
    heroScene.add(ambientPoints);

    // Interaction logic
    document.addEventListener('mousemove', (e) => {
        targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Touch Support
    const updateTouch = (e) => {
        if (e.touches.length > 0) {
            targetMouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
            targetMouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    };

    document.addEventListener('touchstart', updateTouch, { passive: true });
    document.addEventListener('touchmove', updateTouch, { passive: true });

    const lerpIntersect = new THREE.Vector3();
    const clock = new THREE.Clock();

    function animateHero() {
        requestAnimationFrame(animateHero);

        const time = clock.getElapsedTime();

        // 1. Smooth Mouse Tracking
        mouse.x += (targetMouse.x - mouse.x) * 0.1;
        mouse.y += (targetMouse.y - mouse.y) * 0.1;

        // 2. Camera Tilt (Parallax)
        heroCamera.position.x += (mouse.x * 2.0 - heroCamera.position.x) * 0.05;
        heroCamera.position.y += (mouse.y * 2.0 - heroCamera.position.y) * 0.05;
        heroCamera.lookAt(0, 0, 0);

        // 3. Raycasting for Interaction Point
        raycaster.setFromCamera(mouse, heroCamera);
        const currentIntersect = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, currentIntersect);
        lerpIntersect.lerp(currentIntersect, 0.2); // Responsive interaction point

        if (heroCloud) {
            // Slow, majestic rotation
            heroCloud.rotation.y = time * 0.05;

            const posAttr = heroCloud.geometry.attributes.position;
            const positionsArr = posAttr.array;

            // Transform interaction point to local space
            const invRotationY = -heroCloud.rotation.y;
            const localMouse = lerpIntersect.clone();
            localMouse.applyAxisAngle(new THREE.Vector3(0, 1, 0), invRotationY);

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;

                // Base Original Position
                const ox = originalPositions[i3];
                const oy = originalPositions[i3 + 1];
                const oz = originalPositions[i3 + 2];

                // Subtle organic "breathing" noise
                const noiseScale = 0.05;
                const noiseX = Math.sin(time * 0.5 + oy * 0.5) * noiseScale;
                const noiseY = Math.cos(time * 0.3 + ox * 0.5) * noiseScale;
                const noiseZ = Math.sin(time * 0.4 + oz * 0.5) * noiseScale;

                let tarX = ox + noiseX;
                let tarY = oy + noiseY;
                let tarZ = oz + noiseZ;

                // --- GAUSSIAN DENT PHYSICS ---
                const dx = tarX - localMouse.x;
                const dy = tarY - localMouse.y;
                const distSq = dx * dx + dy * dy;

                // Interaction Radius & Dent Strength
                const interactRadiusSq = 16.0; // Radius = 4.0

                if (distSq < interactRadiusSq) {
                    const influence = Math.exp(-distSq * 0.15);
                    const factor = 1.0 - (influence * 0.3); // Shrink radius at impact point

                    tarX *= factor;
                    tarY *= factor;
                    tarZ *= factor;
                }

                // Smooth Elastic Integration
                const elasticity = 0.1;
                positionsArr[i3] += (tarX - positionsArr[i3]) * elasticity;
                positionsArr[i3 + 1] += (tarY - positionsArr[i3 + 1]) * elasticity;
                positionsArr[i3 + 2] += (tarZ - positionsArr[i3 + 2]) * elasticity;
            }
            posAttr.needsUpdate = true;
        }

        ambientPoints.rotation.y += 0.0005;
        ambientPoints.rotation.x += 0.0003;

        heroRenderer.render(heroScene, heroCamera);
    }
    animateHero();

    window.addEventListener('resize', () => {
        heroCamera.aspect = window.innerWidth / window.innerHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(window.innerWidth, window.innerHeight);

        // Dynamic resize logic
        if (window.innerWidth < 768) {
            heroCamera.position.z = 32;
        } else {
            heroCamera.position.z = 22;
        }
    });
}

function initDockAnimation() {
    const dockContainer = document.getElementById('animation-dock');
    if (!dockContainer) return;

    const dockCanvas = document.createElement('canvas');
    dockCanvas.style.width = '100%';
    dockCanvas.style.height = '100%';
    dockContainer.appendChild(dockCanvas);

    dockScene = new THREE.Scene();
    dockCamera = new THREE.PerspectiveCamera(75, 550 / 700, 0.1, 1000);
    dockCamera.position.z = 14;

    dockRenderer = new THREE.WebGLRenderer({
        canvas: dockCanvas,
        alpha: true,
        antialias: true
    });
    dockRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    dockRenderer.setSize(550, 700);

    const count = 4500;
    const geometry = new THREE.BufferGeometry();

    // 1. SPHERE
    const spherePos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2, phi = Math.acos((Math.random() * 2) - 1), r = 4.5 + (Math.random() - 0.5) * 0.6;
        spherePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        spherePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        spherePos[i * 3 + 2] = r * Math.cos(phi);
    }
    shapePositions.push(spherePos);
    shapeColors.push({ r: 0.41, g: 0.41, b: 0.67 }); // #696AAC

    // 2. CUBE
    const boxPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        boxPos[i * 3] = (Math.random() - 0.5) * 8.5;
        boxPos[i * 3 + 1] = (Math.random() - 0.5) * 8.5;
        boxPos[i * 3 + 2] = (Math.random() - 0.5) * 8.5;
    }
    shapePositions.push(boxPos);
    shapeColors.push({ r: 0.24, g: 0.25, b: 0.49 }); // #3E3F7E

    // 3. TORUS
    const torusPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const u = Math.random() * Math.PI * 2, v = Math.random() * Math.PI * 2, R = 5.0, r = 1.8;
        torusPos[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
        torusPos[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
        torusPos[i * 3 + 2] = r * Math.sin(v);
    }
    shapePositions.push(torusPos);
    shapeColors.push({ r: 0.52, g: 0.53, b: 0.89 }); // #8587E3

    // 4. ICOSAHEDRON
    const aiPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r = 5.8, theta = Math.random() * Math.PI * 2, phi = Math.acos((Math.random() * 2) - 1);
        const steps = 8;
        const stheta = Math.round(theta * steps) / steps, sphi = Math.round(phi * steps) / steps;
        aiPos[i * 3] = r * Math.sin(sphi) * Math.cos(stheta);
        aiPos[i * 3 + 1] = r * Math.sin(sphi) * Math.sin(stheta);
        aiPos[i * 3 + 2] = r * Math.cos(sphi);
    }
    shapePositions.push(aiPos);
    shapeColors.push({ r: 0.14, g: 0.14, b: 0.28 }); // #232448

    const currentPos = new Float32Array(spherePos);
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPos, 3));

    const colorsAttr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        colorsAttr[i * 3] = shapeColors[0].r;
        colorsAttr[i * 3 + 1] = shapeColors[0].g;
        colorsAttr[i * 3 + 2] = shapeColors[0].b;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colorsAttr, 3));

    const material = new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });

    dockCloud = new THREE.Points(geometry, material);
    dockScene.add(dockCloud);

    function animateDock() {
        requestAnimationFrame(animateDock);
        if (dockCloud) {
            dockCloud.rotation.y += 0.005;
            dockCloud.rotation.x += 0.002;
        }
        dockRenderer.render(dockScene, dockCamera);
    }
    animateDock();

    // GSAP Pinned Horizontal Scroll with Morphing
    const servicesTrack = document.getElementById('services-track');
    const servicesSection = document.getElementById('services');

    if (servicesTrack && servicesSection) {
        ScrollTrigger.matchMedia({
            // Desktop: Horizontal Scroll
            "(min-width: 1025px)": function () {
                const trackWidth = servicesTrack.scrollWidth;
                const scrollDistance = trackWidth * 3.5; // Increased from 1.5 to fix "jump" and smooth out scrolling

                // Use gsap.set to allow proper reverting
                gsap.set(servicesSection, { height: `${scrollDistance + window.innerHeight}px` });

                gsap.to(servicesTrack, {
                    x: () => -(trackWidth - window.innerWidth + 300),
                    ease: "none",
                    scrollTrigger: {
                        trigger: "#services",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1,
                        pin: ".services-pinned",
                        anticipatePin: 1,
                        onUpdate: (self) => {
                            const progress = self.progress;
                            const cardCount = 8;
                            // Calculate which card is active based on 8 items
                            let target = Math.floor(progress * cardCount);
                            if (target >= cardCount) target = cardCount - 1;

                            // Spread 4 shapes over 8 cards (morphs every 2 cards)
                            let morphTarget = Math.floor(target / 2);

                            if (morphTarget !== currentShape) {
                                morphTo(morphTarget);
                                currentShape = morphTarget;
                            }

                            // Dynamic Color Jump: Update active card class
                            const cards = document.querySelectorAll('.service-item-card');
                            cards.forEach((card, idx) => {
                                if (idx === target) {
                                    card.classList.add('featured');
                                } else {
                                    card.classList.remove('featured');
                                }
                            });
                        }
                    }
                });

                return () => {
                    // Cleanup
                    gsap.set(servicesSection, { clearProps: "height" });
                };
            },
            // Tablet/Mobile: Reset
            "(max-width: 1024px)": function () {
                gsap.set(servicesSection, { clearProps: "height" });
                gsap.set(servicesTrack, { clearProps: "x" }); // Ensure track is reset

                // Allow scrolling on mobile naturally
            }
        });
    }
}

function morphTo(shapeId) {
    const targetPos = shapePositions[shapeId];
    const targetCol = shapeColors[shapeId];
    const currentPos = dockCloud.geometry.attributes.position.array;
    const currentCol = dockCloud.geometry.attributes.color.array;

    gsap.to(currentPos, {
        endArray: targetPos,
        duration: 1.5,
        ease: "expo.inOut",
        onUpdate: () => {
            dockCloud.geometry.attributes.position.needsUpdate = true;
        }
    });

    let colorObj = { r: shapeColors[currentShape].r, g: shapeColors[currentShape].g, b: shapeColors[currentShape].b };
    gsap.to(colorObj, {
        r: targetCol.r,
        g: targetCol.g,
        b: targetCol.b,
        duration: 1.5,
        ease: "expo.inOut",
        onUpdate: () => {
            for (let i = 0; i < currentCol.length / 3; i++) {
                currentCol[i * 3] = colorObj.r;
                currentCol[i * 3 + 1] = colorObj.g;
                currentCol[i * 3 + 2] = colorObj.b;
            }
            dockCloud.geometry.attributes.color.needsUpdate = true;
        }
    });
}

window.addEventListener('load', () => {
    initHeroAnimation();
    initDockAnimation();
});
