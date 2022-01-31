<template>
<v-app>

  <v-app-bar clipped-left app color="primary">
  <v-toolbar-title class="ml-2">Libri Liberi</v-toolbar-title>
  </v-app-bar>

  <v-navigation-drawer clipped permanent app>
    <!-- -->
  </v-navigation-drawer>

  <!-- Sizes your content based upon application components -->
  <v-main>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>

      <!-- If using vue-router -->
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

export default Vue.extend({
  name: 'App',

  data: () => ({
  }),
});
</script>
