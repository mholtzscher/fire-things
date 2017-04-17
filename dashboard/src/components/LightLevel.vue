<template>
    <div>
        <p>Light Level: {{value}}%</p>
    </div>
</template>

<script>
export default {
    name: "lightlevel",
    props: ['value']
}
</script>