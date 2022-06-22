import { defineStore } from 'pinia';
import axios from 'axios';
import { httpOptions, log, logT, api } from '@/utils';
import { shop } from "@/config";
import apolloClient from "@/plugins/apollo.js";
import gql from "graphql-tag";

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
    async fetchPreparedProducts() {
      const url = `${api()}/products-prepared?shop=${shop}`;
      const answer = await axios.get(url);
      log('products state answer', answer);
      this.products = answer.data.result.result.products.body.products;
      log(this.products);
    },
    async fetchProducts() {
      try {
        const url = `${api()}/api/products?shop=${shop}`;
        const answer = await axios.get(url);
        log('products state answer', answer);
        this.products = answer.data.result.result.products.body.products;
        log(this.products);
      } catch (error) {
        log('Error in fetchProducts ', error)
      }
    },

    fetchProducts2() {
      apolloClient
        .query({
          query: gql`{
            products (first: 10) {
              edges {
                node {
                  id
                  title
                  descriptionHtml
                }
              }
            }
          }`,
        })
        .then(( data: any ) => {
           log(1);
           log(1);
           log(1);
           log(data);
           log();
           log();

        });
      },
  }
})
