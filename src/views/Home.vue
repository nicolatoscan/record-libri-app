<template>
  <v-container>
    <v-row class="text-center">

      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.png')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Buon lavoro {{ username }}
        </h1>
      </v-col>

    </v-row>
  </v-container>
</template>

<script lang="ts">
import userService from '@/services/user.service';
import Vue from 'vue'

export default Vue.extend({
  name: 'Home',
  computed: {
    username: function() {
      return userService.getUser()?.username ?? '';
    },
  },
})
</script>
