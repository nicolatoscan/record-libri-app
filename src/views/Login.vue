<template>
  <v-container>
    <v-layout wrap>
      <v-flex sm12 md6 offset-md3>
        <v-card class="elevation-12">
          <v-form v-model="isFormValid" @keyup.native.enter="isFormValid && !loading && login()" onSubmit="return false;">
            <v-toolbar dark color="primary">
              <v-toolbar-title class="flex text-center"><h4>Login</h4></v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-text-field
                autofocus
                v-model="username"
                prepend-icon="mdi-account"
                name="username"
                label="Nome"
                type="text"
                required
                :rules="usernameRules"
              ></v-text-field>
              <v-text-field
                v-model="password"
                id="password"
                prepend-icon="mdi-lock"
                name="password"
                label="Password"
                type="password" 
                required
                :rules="passwordRules"
              ></v-text-field>
            </v-card-text>
            <v-alert class="ma-4" border="left" color="error" v-if="error" >Nome utente o password non validi</v-alert>
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn color="primary" :disabled="!isFormValid || loading" @click="login()">Login</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
            <v-progress-linear :active="loading" indeterminate absolute bottom></v-progress-linear>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import userService from '@/services/user.service';
import apiService from '@/services/api.service';
import rules from  '@/common/form-rules'

export default Vue.extend({
  name: "Login",

  data() {
    return {
      username: "",
      password: "",
      error: false,
      isFormValid: false,
      loading: false,
      usernameRules: [ rules.length(250, 1) ],
      passwordRules: [ rules.length(250, 4, 'La password è di almeno 4 caratteri') ],
    };
  },

  methods: {
    login: async function() {
      this.loading = true;
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
      this.loading = false;
    }
  }
});
</script>
