<template>
  <div>
    <div class="table-wrapper">
      <table class="document-table">
        <thead>
          <tr>
            <th>Asset Tag</th>
            <th>Asset Name</th>
            <th>Model Name</th>
            <th>Location Name</th>
            <th>Warranty</th>
            <th>Purchase Date</th>
            <th>Supplier Name</th>
            <th>Purchase Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(log, i) in assets" :key="i">
            <td>{{ log.assetTag }}</td>
            <td>{{ log.assetName }}</td>
            <td>{{ log.modelName }}</td>
            <td>{{ log.locationName }}</td>
            <td>{{ log.warranty }}</td>
            <td>{{ log.purchaseDate }}</td>
            <td>{{ log.supplierName }}</td>
            <td>{{ log.purchaseCost }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    assets: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.table-title {
  color: #fff;
  margin: 0;
}

.table-wrapper {
  width: 100%;
  max-width: 66.6666vw; /* Ensures 2/3 of screen width */
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin: 0 auto; /* Center align if needed */
}

.document-table {
  width: 100%; /* Let it adapt to wrapper */
  min-width: 1000px; /* Keep minimum readable structure */
  border-collapse: collapse;
  table-layout: fixed;
}

.document-table thead {
  position: sticky;
  top: 0;
  background: #0064a0;
  z-index: 10;
}

.document-table th,
.document-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #e5e5e5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.document-table thead th {
  color: #fff;
  font-weight: bold;
}

@media (max-width: 450px) {
  .table-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>