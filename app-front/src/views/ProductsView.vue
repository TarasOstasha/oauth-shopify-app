<template>
  <main>

    <a class="btn btn-primary" role="button" @click="storeProduct.fetchProducts">Get Products</a>
    <a class="btn btn-primary" role="button" @click="storeProduct.fetchPreparedProducts">Get Prepared Products</a>


    <div v-for="product in storeProduct.products" :key="product.id">
      <div class="card" style="width: 18rem; margin-top: 1rem; padding-top: 1rem;">
        <img src="@/assets/logo.svg" width="50" height="50" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">{{ product.title }}</h5>
          <p class="card-text">Some text.</p>
        </div>
        <ul class="list-group list-group-flush">
          <li v-for="variant in product.variants" :key="variant.id" class="list-group-item">
            {{ variant.title }}
          </li>
        </ul>
        <div class="card-body">
          <a href="#" class="card-link">Do something</a>
        </div>
      </div>
    </div>

  </main>
</template>


<script setup lang="ts">
import { httpOptions, log, logT, api } from '@/utils';
import { useProductStore } from '@/stores/products';
import { onMounted, onUnmounted, ref } from 'vue'

const storeProduct = useProductStore();

onMounted(async () => {
  await storeProduct.fetchProducts();
});

</script>