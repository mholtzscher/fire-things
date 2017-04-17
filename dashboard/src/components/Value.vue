<template>
    <div>
        <temperature v-if="value.name === 'temperature'" :value=value.value></temperature>
        <contact v-if="value.name === 'contact'" :value=value.value></contact>
        <light v-if="value.name === 'switch'" :value=value.value></light>
        <lightlevel v-if="value.name === 'level'" :value=value.value></lightlevel>
        <presence v-if="value.name === 'presence'" :value=value.value></presence>
    </div>
</template>

<script>
import Temperature from './Temperature'
import Contact from './Contact'
import Light from './Light'
import LightLevel from './LightLevel'
import Presence from './Presence'

export default {
    name: "value",
    props: ['value'],
    components: {
        Temperature,
        Contact,
        Light,
        'lightlevel': LightLevel,
        Presence
    }
}
</script>