<template>
  <div>
    <div class="table-wrapper">
      <table class="document-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Manager</th>
            <th>Address</th>
            <th>City</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(log, i) in location"
            :key="i"
            @click="$emit('select-location', log.coordinates)"
            style="cursor: pointer;"
          >
            <td>{{ log.name }}</td>
            <td>{{ log.item }}</td>
            <td>{{ log.assigned }}</td>
            <td>{{ log.user }}</td>
            <td>{{ log.country }}</td>
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
.table-wrapper {
  width: 100%;
  overflow-x: auto; /* Enables horizontal scroll on mobile */
  overflow-y: auto;
  max-height: 320px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.document-table {
  width: 600px; /* Minimum table width for scroll */
  min-width: 100%;
  border-collapse: collapse;
  table-layout: auto;
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
  white-space: nowrap; /* Prevents wrapping */
}

.document-table thead th {
  color: #fff;
  font-weight: bold;
}

/* Small screen responsiveness */
@media (max-width: 450px) {
  .document-table {
    width: max-content; /* Keeps table structure readable */
  }
}
</style>
