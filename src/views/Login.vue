<template>
  <v-container>
    <v-layout wrap>
      <v-flex sm12 md6 offset-md3>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title class="flex text-center"><h4>Login</h4></v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field v-model="username" prepend-icon="mdi-account" name="username" label="Nome" type="text"></v-text-field>
              <v-text-field v-model="password" id="password" prepend-icon="mdi-lock" name="password" label="Password" type="password"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary px-10 py-6 ma-4" @click="login()">Login</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import userService from '../services/user.service';
import apiService from '../services/api.service';

export default Vue.extend({
  name: "Login",

  data() {
    return {
      username: "",
      password: ""
    };
  },

  components: {},

  methods: {
    login: async function() {
      const user = await apiService.auth.login(this.username, this.password);
      apiService.setToken(user.token);
      userService.login(user);
      this.$router.push("/");
    }
  }
});
</script>
