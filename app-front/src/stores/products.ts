import { defineStore } from 'pinia';
import axios from 'axios';
import { httpOptions, log, logT, api } from '@/utils';
import { shop } from "@/config";

interface productState {
  products: [any] | [],
}

export const useProductStore = defineStore({
  id: 'products',
  state: (): any => ({
    products: []
  }),
  getters: {
  },
  actions: {
    async fetchProducts() {
      const url = `${api()}/products-prepared?shop=${shop}`;
      const answer = await axios.get(url);
      log('products state answer', answer);
      this.products = answer.data.result.result.products;
      log(this.products);
    },
    async fetchPreparedProducts() {
      const url = `${api()}/products?shop=${shop}`;
      const answer = await axios.get(url);
      log('products state answer', answer);
      this.products = answer.data.result.result.products;
      log(this.products);
    },

  }
})
