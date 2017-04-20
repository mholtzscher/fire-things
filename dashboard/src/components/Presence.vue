<template>
        <div class="card card-danger">
        <div clas="card-block"
            <div class="card-header text-white">
                <img src="../../static/ic_account_circle_black_24dp_1x.png">
                People
            </div>
            <ul class="list-group list-group-flush">
                <li v-for="value in values" class="list-group-item">
                    <div v-if="value['.value'] === 'present'">{{getDeviceDisplay(value['.key'])}} Is Home</div>
                    <div v-else>{{getDeviceDisplay(value['.key'])}} Is Away</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "presence",
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