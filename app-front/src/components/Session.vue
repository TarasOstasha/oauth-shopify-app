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


<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { httpOptions, log, logT, api } from '@/utils';
import { useAppStore } from '@/stores/app';
const storeApp = useAppStore();

onMounted(async () => {
  await storeApp.fetchSession();
});
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
