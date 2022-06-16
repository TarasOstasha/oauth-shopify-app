<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import axios from 'axios';
import { shop } from "@/config";
import { httpOptions, log, api } from '@/utils';
const storeApp = useAppStore();
const route = useRoute();
</script>

  <template>
    <div class="session-info">
        <div v-if="!storeApp.session.id" @click="storeApp.fetchSession" class="alert alert-danger" role="alert">
            No session! Click to fetch
        </div>
        <div v-if="storeApp.session.id" class="alert alert-success" role="alert">
            You can see session info in console
        </div>
    </div>
</template>

  
<script lang="ts">
export default {
    data() {
        return {
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
    }
}

</script>

<style>
.session-info {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
}
</style>
