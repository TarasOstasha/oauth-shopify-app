<script setup lang="ts">
import Session from '@/components/Session.vue'
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
const route = useRoute();
</script>

<template>
  <Session />
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/dev">Dev</RouterLink>
        <RouterLink to="/products">Products</RouterLink>
      </nav>
      <hr />
      <a class="btn btn-primary" href="https://oauth-shopify-app.herokuapp.com/auth?shop=tonyjoss-store.myshopify.com"
        role="button">Working variant</a>
      <a class="btn btn-primary" role="button" @click="getProducts">Products</a>
      <a class="btn btn-primary" role="button" @click="getProducts2">Products2</a>
    </div>
  </header>
  <RouterView />
</template>

<script lang="ts">

import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios'
// import { useUserStore } from '@/stores/user'
// import { useAppStore } from '@/stores/app'
import { config } from "@/config";
const log = console.log;


export default {

  components: {
  },
  
  // setup() {
  //   const route = useRoute();
  //   // const storeUser = useUserStore()
  //   // const storeApp = useAppStore()
  //   return {
  //     // storeUser,
  //     // storeApp
  //     route
  //   }
  // },

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
      // userData: {},
      // appData: {}

    }
  },

  created() {
    // this.storeApp.init()
    // setInterval(() => {
    //   this.fetchSession();
    // }, 1000);
    log(this.api())
  },

  mounted() {
    setTimeout(() => { this.saveShop() }, 300);
  },

  methods: {
    api: () => {
      return location.hostname == 'localhost'
        ? 'https://oauth-shopify-app.herokuapp.com'
        : ''
    },
    saveShop() {
      const query: any = this.route.query;
      console.log(query)
      const shop: string = query.shop;
      console.log(777, shop);
      // localStorage.setItem('shop', shop);
      this.shop = shop;
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
    async getProducts() {
      // const shop = localStorage.getItem('shop');
      const url = `${this.api()}/api/products?shop=${this.shop}`;
      const answer = await axios.get(url);
      console.log(answer);
    },
    async getProducts2() {
      // const shop = localStorage.getItem('shop');
      const url = `${this.api()}/api/products-count?shop=${this.shop}`;
      const answer = await axios.get(url);
      console.log(answer);
    }
  }
}



</script>




<style>
@import '@/assets/base.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
