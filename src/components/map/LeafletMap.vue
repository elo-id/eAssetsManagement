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
    locations: {
      type: Array,
      required: true,
    },
    flyToCoords: {
      type: Array,
      default: null,
    },
  },
  mounted() {
    this.map = L.map("map").setView([-6.2, 106.8], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this.map);

    // Store markers
    this.markers = [];

    // Add markers and keep references
    this.locations.forEach((loc) => {
      if (Array.isArray(loc.coordinates)) {
        const marker = L.marker(loc.coordinates)
          .addTo(this.map)
          .bindPopup(`<strong>${loc.name}</strong><br>${loc.assigned}`);

        this.markers.push({ coords: loc.coordinates, marker });
      }
    });
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

        // Find the matching marker and open its popup
        const found = this.markers.find(
          (m) => m.coords[0] === newVal[0] && m.coords[1] === newVal[1]
        );

        if (found) {
          found.marker.openPopup();
        }
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
