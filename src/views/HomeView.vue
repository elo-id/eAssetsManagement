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
          <h3>Recent Activity</h3>
          <span class="toggle-icon">{{ showHistoryTable ? "−" : "+" }}</span>
        </div>

        <transition name="collapse">
          <div v-show="showHistoryTable" class="table-content">
            <HistoryTableData :activity="data.activity" />
            <div class="view-all-btn">
              <a href="#" class="view-link">view all →</a>
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
          <div v-show="showLocationTable" class="table-content">
            <LocationTableData :location="data.location" />
            <div class="view-all-btn">
              <a href="#" class="view-link">view all →</a>
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
          <div v-show="showCategoryTable" class="table-content">
            <CategoryTableData :category="data.category" />
            <div class="view-all-btn">
              <a href="#" class="view-link">view all →</a>
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
import HistoryTableData from "@/components/tables/HistoryTableData.vue";
import ChartContainer from "@/components/ChartContainer.vue";
import LocationTableData from "@/components/tables/LocationTableData.vue";
import CategoryTableData from "@/components/tables/CategoryTableData.vue";

export default {
  components: {
    SummaryCard,
    HistoryTableData,
    ChartContainer,
    LocationTableData,
    CategoryTableData,
  },
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

.second-row-container {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
}

.assets-location,
.assets-category {
  list-style-type: none;
  padding: 0;
  flex: 1;
}

.table-content,
.status-content {
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

.view-all-btn {
  margin-top: 12px;
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
  transition: background-color 0.2s ease;
  text-align: center;
}

.view-link:hover {
  background-color: #00bcd4;
}
</style>
