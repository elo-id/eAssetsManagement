<template>
  <div class="chart-container">
    <!-- <h3>Status Document</h3> -->
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default {
  props: {
    chartData: Object,
    options: Object,
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    // Register plugin dynamically inside mounted() to avoid lifecycle issues
    Chart.plugins.unregister(ChartDataLabels);
    Chart.plugins.register(ChartDataLabels);

    this.renderChart();
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.renderChart();
      },
    },
  },
  methods: {
    renderChart() {
      if (this.chart) this.chart.destroy();

      this.chart = new Chart(this.$refs.chartCanvas, {
        type: "pie",
        data: this.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true,
            position: "bottom",
            labels: {
              usePointStyle: true,
              boxWidth: 12,
              padding: 20,
              fontColor: "#333",
              fontSize: 14,
            },
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                const dataset = data.datasets[tooltipItem.datasetIndex].data;
                const total = dataset.reduce((acc, value) => acc + value, 0);
                const value = dataset[tooltipItem.index];
                const percentage = ((value / total) * 100).toFixed(2);
                return `${
                  data.labels[tooltipItem.index]
                }: ${value} (${percentage}%)`;
              },
            },
          },
          plugins: {
            datalabels: {
              color: "white",
              // font: {
              //   weight: "normal",
              //   size: 12,
              // },
              // formatter: (value, context) => {
              //   let label = context.chart.data.labels[context.dataIndex];
              //   return `${label}\n${value}`;
              // },
              // anchor: "center", // ✅ Menjaga posisi teks tetap di tengah slice
              // align: "center", // ✅ Pastikan masih rata tengah
              // offset: 10, // ✅ Jarak lebih kecil untuk menghindari teks keluar
              // clamp: true, // ✅ Mencegah teks keluar area chart
              // clip: false, // ✅ Memastikan teks tetap terlihat
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
/* h3 {
  text-align: center;
  margin-bottom: 0;
} */

.chart-container {
  width: 350px; /* ✅ Adjust width as needed */
  height: 300px; /* ✅ Adjust height as needed */
  max-width: 100%;
  margin: auto;
  position: relative;
  padding: 10px 0;
}
</style>
