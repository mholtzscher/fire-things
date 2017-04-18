<template>
  <div id="app" class="card-columns">
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
