<template>
  <div class="dashboard">
    <div class="summary-grid">
      <SummaryCard
        v-for="(value, key) in data.summary"
        :key="key"
        :title="key"
        :value="value"
      />
    </div>

    <div class="first-row-container">
      <div class="recent-activity">
        <div
          class="table-header"
          :class="{ 'rounded-b-none': showHistoryTable }"
          @click="toggleHistoryTable"
        >
          <h3>List Assets</h3>
          <span class="toggle-icon">{{ showHistoryTable ? "−" : "+" }}</span>
        </div>

        <transition name="collapse">
          <div
            v-show="showHistoryTable"
            class="table-content"
            :class="{ scrollable: showAllAssets }"
          >
            <div class="table-scroll-area">
              <AssetsTableData :assets="visibleAssets" />
            </div>
            <div class="view-all-btn">
              <a
                href="#"
                class="view-link"
                @click.prevent="showAllAssets = !showAllAssets"
              >
                {{ showAllAssets ? "show less ↑" : "view all →" }}
              </a>
            </div>
          </div>
        </transition>
      </div>

      <div class="status-chart">
        <div
          class="status-header"
          :class="{ 'rounded-b-none': showStatus }"
          @click="toggleStatus"
        >
          <h3>Assets by Status</h3>
          <span class="toggle-icon">{{ showStatus ? "−" : "+" }}</span>
        </div>

        <transition name="collapse">
          <div v-show="showStatus" class="status-content">
            <ChartContainer :data="data" />
          </div>
        </transition>
      </div>
    </div>

    <div class="middle-row-container">
      <div
        class="table-header"
        :class="{ 'rounded-b-none': showMap }"
        @click="toggleMap"
      >
        <h3>Assets Map</h3>
        <span class="toggle-icon">{{ showMap ? "−" : "+" }}</span>
      </div>

      <transition name="collapse">
        <div v-show="showMap" class="map-content">
          <LeafletMap :locations="data.location" :flyToCoords="flyToCoords" />
        </div>
      </transition>
    </div>

    <div class="second-row-container">
      <div class="assets-location">
        <div
          class="table-header"
          :class="{ 'rounded-b-none': showLocationTable }"
          @click="toggleLocationTable"
        >
          <h3>Assets Location</h3>
          <span class="toggle-icon">{{ showLocationtable ? "−" : "+" }}</span>
        </div>

        <transition name="collapse">
          <div
            v-show="showLocationTable"
            class="table-content"
            :class="{ scrollable: showAllLocation }"
          >
            <div class="table-scroll-area">
              <LocationTableData
                :location="visibleLocation"
                @select-location="handleMapFlyTo"
              />
            </div>
            <div class="view-all-btn">
              <a
                href="#"
                class="view-link"
                @click.prevent="showAllLocation = !showAllLocation"
              >
                {{ showAllLocation ? "show less ↑" : "view all →" }}
              </a>
            </div>
          </div>
        </transition>
      </div>

      <div class="assets-category">
        <div
          class="table-header"
          :class="{ 'rounded-b-none': showCategoryTable }"
          @click="toggleCategoryTable"
        >
          <h3>Assets Category</h3>
          <span class="toggle-icon">{{ showCategoryTable ? "−" : "+" }}</span>
        </div>

        <transition name="collapse">
          <div
            v-show="showCategoryTable"
            class="table-content"
            :class="{ scrollable: showAllCategory }"
          >
            <div class="table-scroll-area">
              <CategoryTableData :category="visibleCategory" />
            </div>
            <div class="view-all-btn">
              <a
                href="#"
                class="view-link"
                @click.prevent="showAllCategory = !showAllCategory"
              >
                {{ showAllCategory ? "show less ↑" : "view all →" }}
              </a>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import data from "../assets/data.json";
import SummaryCard from "@/components/SummaryCard.vue";
import AssetsTableData from "@/components/tables/ListAssets.vue";
import ChartContainer from "@/components/ChartContainer.vue";
import LocationTableData from "@/components/tables/LocationTableData.vue";
import CategoryTableData from "@/components/tables/CategoryTableData.vue";
import LeafletMap from "@/components/map/LeafletMap.vue";

export default {
  components: {
    SummaryCard,
    AssetsTableData,
    ChartContainer,
    LocationTableData,
    CategoryTableData,
    LeafletMap,
  },
  data() {
    return {
      data,
      showHistoryTable: true,
      showStatus: true,
      showLocationTable: true,
      showCategoryTable: true,
      showAllAssets: false,
      showAllLocation: false,
      showAllCategory: false,
      showMap: true,
      flyToCoords: null,
    };
  },
  methods: {
    toggleHistoryTable() {
      this.showHistoryTable = !this.showHistoryTable;
    },
    toggleStatus() {
      this.showStatus = !this.showStatus;
    },
    toggleLocationTable() {
      this.showLocationTable = !this.showLocationTable;
    },
    toggleCategoryTable() {
      this.showCategoryTable = !this.showCategoryTable;
    },
    toggleMap() {
      this.showMap = !this.showMap;
    },
    handleMapFlyTo(coords) {
      this.flyToCoords = coords;
      // Optional: expand the map section if collapsed
      if (!this.showMap) this.showMap = true;
    }, 
  },
  computed: {
    visibleAssets() {
      return this.showAllAssets
        ? this.data.assets
        : this.data.assets.slice(0, 6);
    },
    visibleLocation() {
      return this.showAllLocation
        ? this.data.location
        : this.data.location.slice(0, 4);
    },
    visibleCategory() {
      return this.showAllCategory
        ? this.data.category
        : this.data.category.slice(0, 4);
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.summary-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.first-row-container,
.second-row-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  margin-top: 20px;
}

/* Allow items to stack vertically on smaller screens */
@media (max-width: 768px) {
  .first-row-container > *,
  .second-row-container > * {
    flex: 1 1 100%;
  }

  .summary-grid > * {
    flex: 1 1 100%;
  }
}

/* Default desktop layout */
.recent-activity {
  flex: 2;
}

.status-chart {
  flex: 1;
}

.assets-location,
.assets-category {
  flex: 1;
}

.middle-row-container {
  margin-top: 20px;
}

/* Headers */
.table-header,
.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #bcc3c6;
  color: #000;
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #d1d5db;
}

.rounded-b-none {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.toggle-icon {
  font-size: 18px;
  font-weight: bold;
  color: #6b7280;
}

/* Content styling */
.table-content,
.status-content {
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0 0 6px 6px;
  overflow-x: auto;
}

.table-content.scrollable {
  max-height: 300px; /* Adjust based on desired visible height */
  overflow-y: auto;
}

.table-scroll-area {
  overflow-y: auto;
  flex-grow: 1;
}

/* Make tables scroll horizontally */
.table-content table,
.status-content table {
  min-width: 600px;
}

/* Collapse transitions */
.collapse-enter-active,
.collapse-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 500px;
  opacity: 1;
}

.view-all-btn {
  margin-top: 9px;
  background: #fff;
  position: sticky;
  bottom: 0;
  z-index: 20;
}

.view-link {
  display: block;
  width: 100%;
  color: #ffffff;
  background-color: #0064a0;
  padding: 10px 0;
  border-radius: 8px;
  font-size: 14px;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.2s ease;
}

.view-link:hover {
  background-color: #00bcd4;
}
</style>
