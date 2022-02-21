<template>
<v-app>

  <!--
    <v-app-bar clipped-left app color="primary">
  <v-toolbar-title class="ml-2">Libri Liberi</v-toolbar-title>
  <v-spacer />
  <v-toolbar-title class="ma-2">{{getUsername()}}</v-toolbar-title>
  <v-btn icon class="ma-2"><v-icon>mdi-exit-to-app</v-icon></v-btn>
  </v-app-bar>
  -->

  <v-navigation-drawer
    clipped
    permanent
    app
    v-if="isLoggedIn()"
    :mini-variant.sync="mini"

  >
    <v-toolbar dark color="primary">
      <v-toolbar-title class="flex text-center">
        <h1 v-if="mini">L</h1>
        <h1 v-else>Libri liberi</h1>
      </v-toolbar-title>
    </v-toolbar>
    <v-list-item class="px-2">
      <v-list-item-avatar>
        <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
      </v-list-item-avatar>

      <v-list-item-title>{{ getUsername() }}</v-list-item-title>

      <v-btn icon @click.stop="mini = !mini">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider></v-divider>
    <Menu />

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block @click="logout()">
          <span v-if="!mini">Logout</span>
          <v-icon v-else class="ml-1">mdi-exit-to-app</v-icon>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>

  <v-main>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-main>

  <!-- <v-footer app></v-footer> -->
</v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import userService from './services/user.service';
import Menu from './components/Menu.vue';

export default Vue.extend({
  name: 'App',
  components: { Menu },

  data: () => ({
    mini: false,
  }),

  methods: {
    isLoggedIn: function() {
      return userService.isLoggedIn();
    },
    getUsername: function() {
      return userService.getUser()?.username ?? '';
    },
    logout: function() {
      userService.logout();
      this.$router.push('/login');
    },
  }
});
</script>
