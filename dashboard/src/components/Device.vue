<template>
    <div>
        <h5>{{dev.device}}</h5>
        <ul>
            <div v-for="value in dev.values">
                <value :value=value></value>
            </div>
        </ul>
    </div>
</template>

<script>
import Value from './Value'

export default {
    name: "device",
    props: ['dev'],
    components: {
        Value
    }
}
</script>