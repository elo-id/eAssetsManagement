<template>
  <nav class="header">
    <div class="title">e Assets Management</div>
    <img src="../assets/logo.png" alt="Vue" width="80px" height="44px" />
  </nav>
</template>

<style scoped>
body {
  transition: background-color 0.3s, color 0.3s;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: white;
  color: black;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: background 0.3s, color 0.3s;
}

.title {
  font-size: 20px;
  font-weight: bold;
}
</style>