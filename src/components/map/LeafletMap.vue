<template>
  <div id="map" class="leaflet-map"></div>
</template>

<script>
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
  name: "LeafletMap",
  props: {
    locations: Array,
    assets: Array,
    flyToCoords: Array,
    flyToAssetCoords: Array,
  },

  mounted() {
    this.map = L.map("map").setView([-6.2, 106.8], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this.map);

    this.locationMarkers = [];
    this.assetMarkers = [];

    // Red marker icon for assets
    const redIcon = new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });

    // Create empty groups
    const locationLayer = L.layerGroup();
    const assetLayer = L.layerGroup();

    // Add location markers (blue)
    this.locations.forEach((loc) => {
      if (Array.isArray(loc.coordinates)) {
        const marker = L.marker(loc.coordinates).bindPopup(
          `<strong>${loc.name}</strong><br>${loc.assigned}`
        );
        marker.addTo(locationLayer);
        this.locationMarkers.push({ coords: loc.coordinates, marker });
      }
    });

    // Add asset markers (red)
    this.assets.forEach((asset) => {
      if (Array.isArray(asset.coordinate)) {
        const marker = L.marker(asset.coordinate, { icon: redIcon }).bindPopup(
          `<strong>${asset.assetName}</strong><br>${asset.locationName}`
        );
        marker.addTo(assetLayer);
        this.assetMarkers.push({ coords: asset.coordinate, marker });
      }
    });

    // Add both layers to map
    locationLayer.addTo(this.map);
    assetLayer.addTo(this.map);

    // Add layer control
    L.control
      .layers(
        null,
        {
          "Show Location Markers (Blue)": locationLayer,
          "Show Asset Markers (Red)": assetLayer,
        },
        { collapsed: false }
      )
      .addTo(this.map);

    // Store layers if needed for later use
    this.locationLayer = locationLayer;
    this.assetLayer = assetLayer;
  },

  beforeDestroy() {
    if (this.map) {
      this.map.remove();
    }
  },
  watch: {
    flyToCoords(newVal) {
      if (this.map && Array.isArray(newVal)) {
        this.map.flyTo(newVal, 12);
        const found = this.locationMarkers.find(
          (m) => m.coords[0] === newVal[0] && m.coords[1] === newVal[1]
        );
        if (found) found.marker.openPopup();
      }
    },
    flyToAssetCoords(newVal) {
      if (this.map && Array.isArray(newVal)) {
        this.map.flyTo(newVal, 12);
        const found = this.assetMarkers.find(
          (m) => m.coords[0] === newVal[0] && m.coords[1] === newVal[1]
        );
        if (found) found.marker.openPopup();
      }
    },
  },
};
</script>

<style scoped>
.leaflet-map {
  width: 100%;
  height: 400px;
}
</style>
