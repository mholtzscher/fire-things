<template>
    <div class="card">
        <div clas="card-block"
            <div class="card-header">
                {{dev.device}}
            </div>
            <ul class="list-group list-group-flush">
                <li v-for="value in dev.values" class="list-group-item">
                    <value :value=value></value>
                </li>
            </ul>
        </div>
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