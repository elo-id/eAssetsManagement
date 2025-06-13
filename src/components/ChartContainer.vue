<template>
  <div class="charts">
    <PieChart :chart-data="pieChartData" :options="chartOptions" />
  </div>
</template>

<script>
import PieChart from "./chartjs/PieChart.vue";

export default {
  components: { PieChart },
  props: {
    data: Array, // Or Object if you're now passing a direct object
  },
  computed: {
    pieChartData() {
      if (!this.data || !this.data.status) return { labels: [], datasets: [] };

      const status = this.data.status;

      return {
        labels: Object.keys(status),
        datasets: [
          {
            data: Object.values(status),
            backgroundColor: ["#28a745", "#ffc107", "#6c757d", "#dc3545"],
            borderWidth: 0,
            borderColor: "transparent",
          },
        ],
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: "bottom",
          labels: {
            usePointStyle: true, // Use small dots instead of squares
            boxWidth: 8, // Adjust dot size
            padding: 20, // Add space between items
            fontColor: "#ffffff", // Text color
            fontSize: 14, // Adjust text size
          },
        },
        tooltips: {
          enabled: true,
        },
      };
    },
  },
};
</script>

<style scoped>
.charts {
  max-width: 100%;
  max-height: 400px;
  overflow: auto;
  border-radius: 8px;
  border: 1px solid #ddd;
}
</style>
