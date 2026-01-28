// Ultimate Scaled Globe - India Hub sequence with Scroll-Triggered Animation
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.globe-container');
    if (!container) return;

    // Create Overlay for HTML Markers
    const overlay = document.createElement('div');
    overlay.className = 'globe-overlay';
    container.appendChild(overlay);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Size and position
    const radius = 11;
    globeGroup.position.y = -radius * 0.35;
    globeGroup.rotation.x = 0.2;

    // Set initial rotation so India hub (lng 77) is directly facing front
    // India theta is lng+180 = 257deg. Front is 90deg. Difference is 167deg (approx 2.9 rad)
    globeGroup.rotation.y = -2.9;

    // 1. Create Dotted Globe
    const createDottedGlobe = () => {
        const dots = 8000;
        const positions = [];
        const color = new THREE.Color(0x8587E3);
        const colors = [];

        for (let i = 0; i < dots; i++) {
            const phi = Math.acos(-1 + (2 * i) / dots);
            const theta = Math.sqrt(dots * Math.PI) * phi;
            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);
            positions.push(x, y, z);
            colors.push(color.r, color.g, color.b);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending
        });

        return new THREE.Points(geometry, material);
    };

    const globeDots = createDottedGlobe();
    globeGroup.add(globeDots);

    // 2. Country Data (India first as primary hub)
    const countries = [
        { id: 'IND', lat: 12.9716, lng: 77.5946, label: 'INDIA', sub: 'Global Headquarters' },
        { id: 'USA', lat: 37.0902, lng: -95.7129, label: 'United States', sub: '120+ Projects' },
        { id: 'UA', lat: 48.3794, lng: 31.1656, label: 'Ukraine', sub: 'Digital Hub' },
        { id: 'UK', lat: 51.5074, lng: -0.1278, label: 'London, UK', sub: 'Fintech HQ' },
        { id: 'UAE', lat: 25.2048, lng: 55.2708, label: 'Dubai, UAE', sub: 'Smart Innovation' },
        { id: 'JPN', lat: 35.6762, lng: 139.6503, label: 'Tokyo, JPN', sub: 'AI Research' },
        { id: 'CAN', lat: 43.6532, lng: -79.3832, label: 'Toronto, CAN', sub: 'Creative Studio' },
        { id: 'SGP', lat: 1.3521, lng: 103.8198, label: 'Singapore', sub: 'Data Center' },
        { id: 'GER', lat: 52.5200, lng: 13.4050, label: 'Berlin, GER', sub: 'Engineering' }
    ];

    const convertCoords = (lat, lng, r) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            -r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta)
        );
    };

    // 3. Create Markers and Connections (arcs)
    const markers = [];
    const arcs = [];

    const setupMarkersAndArcs = () => {
        const hubPos = convertCoords(countries[0].lat, countries[0].lng, radius);

        countries.forEach((country, index) => {
            const pos = convertCoords(country.lat, country.lng, radius);

            // Marker 3D Node
            const markerGeom = new THREE.SphereGeometry(0.15, 16, 16);
            const markerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
            const mesh = new THREE.Mesh(markerGeom, markerMat);
            mesh.position.copy(pos);
            globeGroup.add(mesh);

            // HTML UI Element
            const el = document.createElement('div');
            el.className = 'globe-marker';
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            el.innerHTML = `
                <div class="marker-point"></div>
                <div class="marker-label-hud">
                    <div class="label-line"></div>
                    <div class="label-content">
                        <span class="country-name">${country.label}</span>
                        <p class="country-sub">${country.sub}</p>
                    </div>
                </div>
            `;

            el.addEventListener('mouseenter', () => { isMarkerHovered = true; });
            el.addEventListener('mouseleave', () => { isMarkerHovered = false; });
            overlay.appendChild(el);

            markers.push({ mesh, el, country, revealed: false });

            // Connection Arc from India (except India itself)
            if (index > 0) {
                const midPoint = new THREE.Vector3().addVectors(hubPos, pos).multiplyScalar(0.5);
                midPoint.normalize().multiplyScalar(radius * 1.5);

                const curve = new THREE.QuadraticBezierCurve3(hubPos, midPoint, pos);
                const arcPoints = curve.getPoints(60);
                const lineGeom = new THREE.BufferGeometry().setFromPoints(arcPoints);
                const lineMat = new THREE.LineBasicMaterial({
                    color: 0x8587E3,
                    transparent: true,
                    opacity: 0,
                    blending: THREE.AdditiveBlending
                });
                const line = new THREE.Line(lineGeom, lineMat);
                line.visible = false;
                globeGroup.add(line);
                arcs.push({ line, lineMat });
            }
        });
    };

    setupMarkersAndArcs();

    camera.position.z = 28;

    // 4. Animation Sequencing Logic
    let hasStartedAnimation = false;
    let isMarkerHovered = false;
    let isDragging = false;
    let targetRotationY = -2.9;
    let targetRotationX = 0.2;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const startEntranceSequence = () => {
        if (hasStartedAnimation) return;
        hasStartedAnimation = true;

        const india = markers[0];

        // Ensure we reveal India HQ IMMEDIATELY since it's already centered
        india.el.style.visibility = 'visible';
        gsap.to(india.el, { opacity: 1, duration: 1.2, delay: 0.5 });

        // Stagger reveal others
        setTimeout(() => {
            markers.slice(1).forEach((m, i) => {
                setTimeout(() => {
                    m.el.style.visibility = 'visible';
                    gsap.to(m.el, { opacity: 1, duration: 1 });

                    const arc = arcs[i];
                    if (arc) {
                        arc.line.visible = true;
                        gsap.to(arc.lineMat, { opacity: 0.35, duration: 1.5 });
                    }
                }, i * 400);
            });
        }, 1200);
    };

    // Scroll Trigger
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) startEntranceSequence();
    }, { threshold: 0.3 });
    observer.observe(container);

    // interaction logic
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            targetRotationY += (e.clientX - previousMouseX) * 0.01;
            targetRotationX += (e.clientY - previousMouseY) * 0.01;
            previousMouseX = e.clientX;
            previousMouseY = e.clientY;
        }
    });

    const updateMarkersVisibility = () => {
        const widthHalf = container.clientWidth / 2;
        const heightHalf = container.clientHeight / 2;

        markers.forEach(marker => {
            const vector = marker.mesh.getWorldPosition(new THREE.Vector3());
            const cameraPos = camera.position.clone();
            const distanceToMarker = cameraPos.distanceTo(vector);
            const distanceToCenter = cameraPos.distanceTo(new THREE.Vector3(0, globeGroup.position.y, 0));

            // Only show markers on the front side (facing viewer)
            if (distanceToMarker < distanceToCenter) {
                if (hasStartedAnimation) marker.el.style.display = 'block';
                vector.project(camera);
                marker.el.style.left = `${(vector.x * widthHalf) + widthHalf}px`;
                marker.el.style.top = `${-(vector.y * heightHalf) + heightHalf}px`;
            } else {
                marker.el.style.display = 'none';
            }
        });
    };

    const animate = () => {
        requestAnimationFrame(animate);

        globeGroup.rotation.y += 0.05 * (targetRotationY - globeGroup.rotation.y);
        globeGroup.rotation.x += 0.05 * (targetRotationX - globeGroup.rotation.x);

        if (hasStartedAnimation && !isDragging && !isMarkerHovered) {
            targetRotationY += 0.0006;
        }

        updateMarkersVisibility();
        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});
