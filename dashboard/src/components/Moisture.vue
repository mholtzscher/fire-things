<template>
    <div class="card card-primary">
        <div clas="card-block"
            <div class="card-header text-white">
                <img src="../../static/ic_opacity_black_24dp_1x.png">
                Water Sensors
            </div>
            <ul class="list-group list-group-flush">
                <li v-for="value in values" class="list-group-item">
                    {{ getDeviceDisplay(value['.key']) }} is {{ value['.value'] }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "temperature",
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