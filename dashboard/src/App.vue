<template>
  <div class="container">
    <div id="app" class="card-columns">
      <light :values=switches :levels=levels :devices=devices></light>
      <temperature :values=temps :devices=devices></temperature>
      <contact :values=contacts :devices=devices></contact>
      <presence :values=residents :devices=devices></presence>
      <moisture :values=moisture :devices=devices></moisture>
      <motion :values=motions :devices=devices></motion>
    </div>
  </div>
</template>

<script>
import Light from './components/Light'
import Temperature from './components/Temperature'
import Contact from './components/Contact'
import Presence from './components/Presence'
import Moisture from './components/Moisture'
import Motion from './components/Motion'
import firebaseApp from './db.js'

let db = firebaseApp.database()
let deviceRef = db.ref('devices')
let switchRef = db.ref('switch')
let switchLevelRef = db.ref('level')
let tempRef = db.ref('temperature')
let contactRef = db.ref('contact')
let presenceRef = db.ref('presence')
let moistureRef = db.ref('water')
let motionRef = db.ref('motion')

export default {
  name: 'app',
  components: {
    Light,
    Temperature,
    Contact,
    Presence,
    Moisture,
    Motion  
  },
  firebase: {
    devices: deviceRef,
    switches: switchRef,
    levels: switchLevelRef,
    temps: tempRef,
    contacts: contactRef,
    residents: presenceRef,
    moisture: moistureRef,
    motions: motionRef
  }
  
}
</script>
