import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { WebApp } from '@elo/core';
// if IXConnecttion is needed
import de from '@elo/eloixclient';
// if ELO session is needed
import { Session } from '@elo/session';

Vue.config.productionTip = false

// Initialize Vue after initializing the ELO App.
WebApp.setOnLoad(function() {
    new Vue({
        router,
        store,
        render: (h) => h(App)
    }).$mount('#app');
});

// Initialize the ELO App.
// if no ELO session is needed
// WebApp.init();
// if ELO session is needed, but no IXConnection
// Session.init();
// if IXConnection is needed
Session.init(de.elo.ix.client);