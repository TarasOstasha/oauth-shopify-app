import { defineStore } from 'pinia';
import axios from 'axios';
import { httpOptions, log, logT, api } from '@/utils';
import { shop } from "@/config";

interface productState{
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
      log(answer);
      this.products = answer.data.body.products;
      log(this.products);

  },
  }
})
