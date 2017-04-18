<template>
    <div>
        <p v-bind:class="[value === 'open' ? 'bg-danger text-white' : 'bg-success text-white']">Contact Sensor: {{value}}</p>
    </div>
</template>

<script>
export default {
    name: "contact",
    props: ['value']
}
</script>