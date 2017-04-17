<template>
  <div id="app">
    <div v-for="device in devices">
      <device :dev=device></device>
    </div>

  </div>
</template>

<script>
import Device from './components/Device'
import db from './db.js'

let deviceRef = db.ref('devices')

export default {
  name: 'app',
  components: {
    Device  
  },
  firebase: {
    devices: deviceRef
  }
  
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
