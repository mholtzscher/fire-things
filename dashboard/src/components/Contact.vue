<template>
    <div class="card card-warning">
        <div clas="card-block"
            <div class="card-header text-white">
                Contact Sensors
            </div>
            <ul class="list-group list-group-flush">
                <li v-for="value in values" class="list-group-item">
                    {{ getDeviceDisplay(value['.key']) }} is&ensp;
                    <div class="badge" v-bind:class="[value['.value'] === 'open' ? 'badge-danger' : 'badge-success']">
                        {{ value['.value'] }}
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "contact",
    props: ['values', 'devices'],
     methods: {
        getDeviceDisplay: function (deviceId){
            var name = ''
            this.devices.forEach(function(item, index, array){
                if(item['.key'] === deviceId){
                    name = item.device;
                }
            });
            return name;
        }
    }
}
</script>