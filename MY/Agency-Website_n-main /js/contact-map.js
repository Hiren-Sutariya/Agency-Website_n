
document.addEventListener('DOMContentLoaded', () => {
    // Check if map container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Initialize map centered on Opera Business Hub, Surat
    const map = L.map('map', {
        center: [21.23799, 72.88901],
        zoom: 15,
        zoomControl: false, // Custom zoom control position if needed
        scrollWheelZoom: false, // Prevent scrolling page when zooming map
        attributionControl: false
    });

    // Add Dark Matter Tiles (CartoDB)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Custom Icon
    const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div class="marker-pulse"></div><div class="marker-core"></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // Add Marker
    L.marker([21.23799, 72.88901], { icon: customIcon }).addTo(map)
        .bindPopup(`
            <div class="custom-popup">
                <h4 class="text-brand font-bold uppercase tracking-widest text-xs mb-1">HQ</h4>
                <p class="text-white font-bold text-center">Opera Business Hub, <br> Surat</p>
            </div>
        `)
        .openPopup();

    // Add Zoom Control to bottom right
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Force map invalidation on resize to prevent grey tiles
    window.addEventListener('resize', () => {
        map.invalidateSize();
    });
});
