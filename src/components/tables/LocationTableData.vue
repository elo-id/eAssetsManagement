<template>
  <div>
    <div class="table-wrapper">
      <table class="document-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Item</th>
            <th>Assigned</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(log, i) in location" :key="i">
            <td>{{ log.name }}</td>
            <td>{{ log.item }}</td>
            <td>{{ log.assigned }}</td>
            <td>{{ log.user }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    location: {
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
  color: #1c4471;
  margin: 0;
}

.table-wrapper {
  max-width: 100%;
  max-height: 320px;
  overflow: auto;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.document-table {
  width: 100%;
  border-collapse: collapse;
}

.document-table thead {
  position: sticky;
  top: 0;
  background: #f7f7f7;
  z-index: 10;
}

.document-table th,
.document-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #e5e5e5;
  white-space: nowrap;
}

.document-table thead th {
  color: #1c4471;
  font-weight: bold;
}

@media (max-width: 450px) {
  .table-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
