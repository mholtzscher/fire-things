<template>
        <div class="card card-danger">
        <div clas="card-block"
            <div class="card-header text-white">
                People
            </div>
            <ul class="list-group list-group-flush">
                <li v-for="value in values" class="list-group-item">
                    <p v-if="value['.value'] === 'present'">{{getDeviceDisplay(value['.key'])}} Is Home</p>
                    <p v-else>{{getDeviceDisplay(value['.key'])}} Is Away</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "presence",
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