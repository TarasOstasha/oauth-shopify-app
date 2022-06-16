<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import axios from 'axios';
import { httpOptions, log, api } from '@/utils';
import Session from '@/components/Session.vue';
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { shop } from "@/config";

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
      <!-- <a class="btn btn-primary" role="button" @click="prepareData">Prepare data</a> -->
      <a class="btn btn-primary" href="https://oauth-shopify-app.herokuapp.com/auth?shop=tonyjoss-store.myshopify.com"
        role="button">Working variant</a>
      <hr />
    </div>
  </header>
  <RouterView />
</template>

<script lang="ts">

export default {
  data() {
    return {
    }
  },

  created() {
    // this.storeApp.init()
    // setInterval(() => {
    //   this.fetchSession();
    // }, 1000);
    log(api())
  },

  mounted() {
    // setTimeout(() => { this.saveShop() }, 300);
  },

  methods: {
    // saveShop() {
    //   const query: any = this.route.query;
    //   log(query)
    //   const shop: string = query.shop;
    //   log(777, shop);
    //   // localStorage.setItem('shop', shop);
    //   this.shop = shop;
    // },

    async getProducts() {
      const url = `${api()}/api/products?shop=${shop}`;
      const answer = await axios.get(url);
      log(answer);
    },
    async getProducts2() {
      const url = `${api()}/api/products-count?shop=${shop}`;
      const answer = await axios.get(url);
      log(answer);
    },
    // async prepareData() {
    //   const url = `${api()}/api/prepare-data?shop=${shop}`;
    //   const answer = await axios.get(url);
    //   log(answer);
    // }
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
