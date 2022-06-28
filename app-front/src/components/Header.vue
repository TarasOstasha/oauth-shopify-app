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
      <a class="btn btn-primary" href="https://oauth-shopify-app.herokuapp.com/auth?shop=tonyjoss-store.myshopify.com"
        role="button">Working variant</a>
      <hr />
    </div>
  </header>
  <RouterView />
</template>

<script lang="ts">

export default {
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
  }
}

</script>