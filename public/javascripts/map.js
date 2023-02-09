mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    closeOnMove: true,
    offset: 25
}).setHTML(
    `<h5>${campground.title}</h5>`);

const marker1 = new mapboxgl.Marker({ color: '#1A8754' })
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);