<template>
    <div>
        <p>Temperature: {{value}}F</p>
    </div>
</template>

<script>
export default {
    name: "temperature",
    props: ['value']
}
</script>