  <template>
    <div class="session-info">
        <div v-if="!session.id" class="alert alert-danger" role="alert">
            No session !!!
        </div>
        <div v-if="session.id" class="alert alert-success" role="alert">
            Session info:
            <div>
                aession: {{ session }}
            </div>
            <div>
                accessToken: {{ session.accessToken }}
            </div>
            <div>
                id: {{ session.id }}
            </div>
            <div>
                isOnline: {{ session.isOnline }}
            </div>
            <div>
                scope: {{ session.scope }}
            </div>
            <div>
                shop: {{ session.shop }}
            </div>
            <div>
                state: {{ session.state }}
            </div>
        </div>

        <a class="btn btn-primary" role="button" @click="fetchSession">fetchSession</a>

    </div>
</template>


  
<script lang="ts">

import axios from 'axios'
// import { useUserStore } from '@/stores/user'
// import { useAppStore } from '@/stores/app'
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { config } from "@/config";
const log = console.log;

export default {
    components: {
    },
    setup() {
        const route = useRoute();
        // const storeUser = useUserStore()
        // const storeApp = useAppStore()
        return {
            // storeUser,
            // storeApp
            route
        }
    },
    data() {
        return {
            session: {
                accessToken: null, // "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"
                id: null, // "offline_tonyjoss-store.myshopify.com"
                isOnline: null, // false
                scope: null, // "write_products,write_customers,write_draft_orders"
                shop: null, // "tonyjoss-store.myshopify.com"
                state: null, // "608570500830120"
            },
            shop: '',

        }
    },

    created() {

        log(this.api())
    },
    mounted() {
    },
    methods: {
        api: () => {
            return location.hostname == 'localhost'
                ? 'https://oauth-shopify-app.herokuapp.com'
                : ''
        },

        async fetchSession() {
            // const shop = localStorage.getItem('shop');
            this.shop = 'tonyjoss-store.myshopify.com';
            const url = `${this.api()}/session-info?shop=${this.shop}`;
            const answer = await axios.get(url);
            log(answer);
            const session = answer.data.sessionSave;
            if (session) this.session = session;
        },

    }
}

</script>

<style>
.session-info {
    display: flex;
}
</style>
