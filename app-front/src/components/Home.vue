
<script setup lang="ts">
let myMsg = "hello from home component";
import Sidebar from "@/components/sidebar.vue";
import Header from '@/components/header.vue';
import Vue from "vue";
import { httpOptions, log, api } from '@/utils';
import { shop } from "@/config";
import axios from 'axios';

</script>

<template>
  <div id="app">
    <h1>{{myMsg}}</h1>
    <div class="row">
      <div class="col-md-3">
        <Sidebar />
      </div>
      <div class="col-md-9">
        <!-- Button trigger modal -->
        <input
          class="search"
          type="text"
          placeholder="Choose a product to add options"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        />
        <!-- Modal -->
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Choose a product to add options</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1">
                    <i class="bi bi-search"></i>
                  </span>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="form-control"
                    placeholder="Search products"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
                <hr />
                <ul class="list-group">
                  <li class="list-group-item" v-for="item in resultQuery" :key="item.id">
                    <input type="radio" name="aGroup" :id="item.name">
                    <label :for="item.name">{{ item.name }}</label>
                    
                  </li>
                </ul>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary">Choose</button>
              </div>
            </div>
          </div>
        </div>
        <img :src=" 'src/assets/ui-home.png' " alt />
      </div>
    </div>
  </div>
</template>

<script lang="ts">



export default {
  data() {
    return {
      searchQuery: null,
      test: [
        { id: 1, name: "product1" },
        { id: 2, name: "product2" },
        { id: 3, name: "product3" },
        { id: 4, name: "product4" },
        { id: 5, name: "product5" },
        { id: 6, name: "product6" },
        { id: 7, name: "product7" },
        { id: 8, name: "product8" },
      ],
      resources: this.getProducts()
    };
  },
  computed: {
     resultQuery() {
         if(this.searchQuery) {
             return this.resources.filter(item => {
                 return this.searchQuery
                    .toLowerCase()
                    .split(" ")
                    .every(v => item.name.toLowerCase().includes(v));
             });
         } else {
             return this.resources;
         }
     } 
  },
  methods: {
    async getProducts() {
      const url = `${api()}/api/products?shop=${shop}`;
      const answer = await axios.get(url);
      log(answer);
    },
  }
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.3/font/bootstrap-icons.css");
img {
  width: 100%;
}
.search {
  margin: 1em 0;
  width: 100%;
  padding: 0.5em;
}
.list-group-item {
    display: flex;
    align-items: center;
    cursor: pointer;
}
.list-group-item:hover {
    background-color: #050709;
}
.list-group-item input {
    margin-right: 1em;
}
.list-group-item label {
    width: 100%;
    cursor: pointer;
}
</style>