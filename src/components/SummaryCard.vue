<template>
  <div class="card">
    <p class="value">{{ value }}</p>
    <p class="title">{{ title }}</p>
    <!-- <div class="view-all-btn">
      <a href="#" class="view-link">view all →</a>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    value: [String, Number]
  }
};
</script>

<style scoped>
.card {
  flex: 1;
  background: #bcc3c6 !important;
  border-radius: 8px;
  text-align: center;
  color: #303030;
}

.value {
  font-size: 24px;
  font-weight: bolder;
  text-transform: capitalize;
  margin: 20px 0 15px 0;
}

.title {
  font-size: 24px;
  font-weight: bolder;
  text-transform: capitalize;
  margin: 0 0 20px 0;
}

.view-all-btn {
  margin-top: 12px;
}

.view-link {
  display: block;
  width: 100%;
  color: #ffffff;
  background-color: #00bcd4;
  padding: 10px 0;
  border-radius: 0 0 8px 8px;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.2s ease;
  text-align: center;
}

.view-link:hover {
  background-color: #0064a0;
}
</style>
