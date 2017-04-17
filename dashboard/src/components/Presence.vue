<template>
    <div>
        <p v-if="value === 'present'">Home</p>
        <p v-else>Away</p>
    </div>
</template>

<script>
export default {
    name: "presence",
    props: ['value']
}
</script>