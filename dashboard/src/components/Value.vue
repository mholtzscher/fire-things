<template>
    <div>
        <p>Name: {{value.name}} -- Value: {{value.value}} -- Time: {{value.updateTime}}</p>
    </div>
</template>

<script>
export default {
    name: "value",
    props: ['value']
}
</script>