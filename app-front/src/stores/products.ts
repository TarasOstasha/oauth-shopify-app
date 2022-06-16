import { defineStore } from 'pinia'
import axios from 'axios'
import { httpOptions, log, api } from '@/utils'

export const useProductStore = defineStore({
  id: 'products',
  state: () => ({
    products: []
  }),
  getters: {
  },
  actions: {
    async refresh() {
      const url = `${api()}/api/products-prepared?shop=${this.shop}`;

      const answer = await axios.get('http://localhost:3001/api/post', httpOptions);
      log(answer);
      this.products = answer.data.products;
  },
  }
})
