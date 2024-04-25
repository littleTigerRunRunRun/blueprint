import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Home from './examples/home.vue'
import ReteBasic from './examples/rete/basic.vue'
import ReteControl from './examples/rete/renderer/index.vue'
import ReteDataFlow from './examples/rete/dataFlow/index.vue'
import ReteControlFlow from './examples/rete/controlFlow/index.vue'
import ReteHybridFlow from './examples/rete/hybrid/index.vue'
import ReteCustomization from './examples/rete/customization/index.vue'
import ReteNest from './examples/rete/nest/index.vue'

import ASTBasic from './examples/ast/basic/index.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/rete-basic',
      name: 'reteBasic',
      component: ReteBasic
    },
    {
      path: '/rete-control',
      name: 'reteControl',
      component: ReteControl
    },
    {
      path: '/rete-dataflow',
      name: 'reteDataFlow',
      component: ReteDataFlow
    },
    {
      path: '/rete-controlflow',
      name: 'reteControlFlow',
      component: ReteControlFlow
    },
    {
      path: '/rete-hybrid',
      name: 'reteHybrid',
      component: ReteHybridFlow
    },
    {
      path: '/rete-customization',
      name: 'reteCustomization',
      component: ReteCustomization
    },
    {
      path: '/rete-nest',
      name: 'reteNest',
      component: ReteNest
    },
    {
      path: '/ast-basic',
      name: 'ASTBasic',
      component: ASTBasic
    }
  ]
})


createApp(App)
  .use(router)  
  .mount('#app')
