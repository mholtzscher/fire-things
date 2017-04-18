<template>
    <div class="card card-warning">
        <div clas="card-block"
            <div class="card-header text-white">
                Contact Sensors
            </div>
            <ul class="list-group list-group-flush">
                <li v-for="value in values" class="list-group-item">
                    <p v-bind:class="[value === 'open' ? 'bg-danger text-white' : 'bg-success text-white']">
                         {{ getDeviceDisplay(value['.key']) }} is {{ value['.value'] }}
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "contact",
    props: ['values'],
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