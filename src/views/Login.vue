<template>
  <v-container>
    <v-layout wrap>
      <v-flex sm12 md6 offset-md3>
        <v-card class="elevation-12">
          <v-toolbar dark color="secondary">
            <v-toolbar-title class="flex text-center"><h4>Login</h4></v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field v-model="username" prepend-icon="mdi-account" name="username" label="Nome" type="text" required></v-text-field>
              <v-text-field v-model="password" id="password" prepend-icon="mdi-lock" name="password" label="Password" type="password" required></v-text-field>
            </v-form>
          </v-card-text>
          <v-alert class="ma-4" border="left" color="error" v-if="error" >Nome utente o password non validi</v-alert>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login()" @keyup.enter="login()" :disabled="loginDisabled()">Login</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import userService from '@/services/user.service';
import apiService from '@/services/api.service';

export default Vue.extend({
  name: "Login",

  data() {
    return {
      username: "",
      password: "",
      error: false,
    };
  },

  methods: {
    login: async function() {
      this.error = false;
      const user = await apiService.auth.login(this.username, this.password);
      if (user?.token) {
        apiService.setToken(user.token);
        userService.login(user);
        this.$router.push("/");
      } else {
        this.error = true;
        this.username = "";
        this.password = "";
      }
    },
    loginDisabled: function() {
      return !this.username || !this.password;
    }
  }
});
</script>
