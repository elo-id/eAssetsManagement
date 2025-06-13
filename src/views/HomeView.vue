<template>
  <div class="dashboard">
    <div class="summary-grid">
      <div class="card" v-for="(value, key) in data.summary" :key="key">
        <h2>{{ value }}</h2>
        <p>{{ key }}</p>
      </div>
    </div>

    <div class="first-row-container">
      <div class="recent-activity">
        <div class="table-header" @click="toggleHistoryTable">
          <h3>Recent Activity</h3>
          <span class="toggle-icon">{{ showHistoryTable ? "−" : "+" }}</span>
        </div>
  
        <transition name="collapse">
          <div v-show="showHistoryTable" class="table-content">
            <HistoryTableData :activity="data.activity" />
          </div>
        </transition>
      </div>
  
      <div class="status-chart">
        <div class="status-header" @click="toggleStatus">
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

    <div class="second-row-container">
      <div class="assets-location">
        <div class="table-header" @click="toggleLocationTable">
          <h3>Assets Location</h3>
          <span class="toggle-icon">{{ showLocationtable ? "−" : "+" }}</span>
        </div>
  
        <transition name="collapse">
          <div v-show="showLocationTable" class="table-content">
            <LocationTableData :location="data.location" />
          </div>
        </transition>
      </div>
  
      <div class="assets-category">
        <div class="table-header" @click="toggleCategoryTable">
          <h3>Assets Category</h3>
          <span class="toggle-icon">{{ showCategoryTable ? "−" : "+" }}</span>
        </div>
  
        <transition name="collapse">
          <div v-show="showCategoryTable" class="table-content">
            <CategoryTableData :category="data.category" />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import data from "../assets/data.json";
import HistoryTableData from "@/components/tables/HistoryTableData.vue";
import ChartContainer from "@/components/ChartContainer.vue";
import LocationTableData from "@/components/tables/LocationTableData.vue";
import CategoryTableData from "@/components/tables/CategoryTableData.vue";

export default {
  components: { HistoryTableData, ChartContainer, LocationTableData, CategoryTableData },
  data() {
    return {
      data,
      showHistoryTable: true,
      showStatus: true,
      showLocationTable: true,
      showCategoryTable: true,
    };
  },
  methods: {
    toggleHistoryTable() {
      this.showHistoryTable = !this.showHistoryTable
    },
    toggleStatus() {
      this.showStatus = !this.showStatus;
    },
    toggleLocationTable() {
      this.showLocationTable = !this.showLocationTable
    },
    toggleCategoryTable() {
      this.showCategoryTable = !this.showCategoryTable
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
  gap: 16px;
  margin-bottom: 16px;
}

.card {
  flex: 1;
  background: #f3f3f3;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.activity-section table {
  width: 100%;
  border-collapse: collapse;
}

.activity-section th,
.activity-section td {
  border: 1px solid #ddd;
  padding: 8px;
}

.first-row-container {
 display: flex;
 justify-content: space-between;
 gap: 16px;
}

.recent-activity {
  list-style-type: none;
  padding: 0;
  flex: 2;
}

.status-chart {
  list-style-type: none;
  padding: 0;
  flex: 1;
}

.table-header, .status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fc;
  padding: 12px 16px;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  border: 1px solid #d1d5db;
}

.toggle-icon {
  font-size: 18px;
  font-weight: bold;
  color: #6b7280;
}

.second-row-container {
 display: flex;
 justify-content: space-between;
 gap: 16px;
 margin-top: 16px;
}

.assets-location, .assets-category {
  list-style-type: none;
  padding: 0;
  flex: 1;
}

.table-content, .status-content {
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0 0 6px 6px;
}

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
  max-height: 500px; /* Adjust based on expected content size */
  opacity: 1;
}
</style>
