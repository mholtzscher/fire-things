<template>
    <div class="card card-info">
        <div clas="card-block"
            <div class="card-header text-white">
                <img src="../../static/ic_lightbulb_outline_black_24dp_1x.png">
                Switches
            </div>
            <ul class="list-group list-group-flush">
                <li v-for="value in values" class="list-group-item">
                    {{ getDeviceDisplay(value['.key']) }} is {{ value['.value'] }} {{ getLevelForLight(value['.key']) }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "light",
    props: ['values', 'devices', 'levels'],
    methods: {
        getDeviceDisplay: function (deviceId){
            var name = ''
            this.devices.forEach(function(item, index, array){
                if(item['.key'] === deviceId){
                    name = item.device;
                }
            });
            return name;
        },
         getLevelForLight: function (deviceId){
            var level = ''
            this.levels.forEach(function(item, index, array){
                if(item['.key'] === deviceId){
                    level = item['.value'];
                }
            });
             
            if (level !== ''){
                return ' at ' + level + '%';
            }
        }
    }
}
</script>