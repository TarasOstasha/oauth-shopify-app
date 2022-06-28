import { defineStore } from 'pinia'
import axios from 'axios'
import { httpOptions, log, logT, api } from '@/utils'
import { shop } from "@/config";

export const useAppStore = defineStore({
  id: 'app',
  state: () => ({
    session: {
      accessToken: null, // "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"
      id: null,          // "offline_tonyjoss-store.myshopify.com"
      isOnline: null,    // false
      scope: null,       // "write_products,write_customers,write_draft_orders"
      shop: null,        // "tonyjoss-store.myshopify.com"
      state: null,       // "608570500830120"
    }
  }),
  getters: {
  },

  actions: {
    async fetchSession() {
      const url = `${api()}/session-info?shop=${shop}`;
      const answer = await axios.get(url);
      log('app state answer', answer);
      const session = answer.data.result.result.sessionSave;
      logT(session);
      if (session) {
        localStorage.setItem('token', `Bearer ${session.accessToken}`)

        this.session = session;
      };
    },
    // async refresh() {
    //   const url = `${api()}/api/products-prepared?shop=${this.shop}`;

    //   const answer = await axios.get('http://localhost:3001/api/post', httpOptions);
    //   log(answer);
    //   this.products = answer.data.products;
    // },
  }
})
