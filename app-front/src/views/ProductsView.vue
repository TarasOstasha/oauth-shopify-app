<script setup lang="ts">
import { httpOptions, log, logT, api } from '@/utils';
import { useProductStore } from '@/stores/products';
const storeProduct = useProductStore();
</script>

<template>
  <main>
    Products

  </main>
</template>

<script lang="ts">
export default {
  data() {
    return {
    }
  },
  created() {
  },
  async mounted() {
    await this.storeProduct.fetchProducts();
    log(this.storeProduct.products);
  },
  methods: {
  }
}
</script>