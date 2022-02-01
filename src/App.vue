<template>
<v-app>

  <v-app-bar clipped-left app color="primary">
  <v-toolbar-title class="ml-2">Libri Liberi</v-toolbar-title>
  <v-spacer />
  <v-toolbar-title class="ml-2">{{getUsername()}}</v-toolbar-title>
  </v-app-bar>

  <v-navigation-drawer clipped permanent app v-if="getUsername()">
    <!-- -->
  </v-navigation-drawer>

  <v-main>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-main>

  <v-footer app>
    <!-- -->
  </v-footer>
</v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import userService from './services/user.service';

export default Vue.extend({
  name: 'App',

  data: () => ({
  }),

  methods: {
    getUsername: function() {
      return userService.getUser()?.username ?? '';
    },
  }
});
</script>
