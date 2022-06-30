import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { DefaultApolloClient } from "@vue/apollo-composable";


import App from './App.vue'
import router from './router'

// import defaultLayout from "~/layouts/default";
// import loggedInLayout from "~/layouts/loggedIn";

const app = createApp(App)


app.use(createPinia())
app.use(router)
//   app.component("default", defaultLayout)
//   app.component("loggedIn", loggedInLayout)
app.mount('#app')