<template>
  <v-list dense nav>
    <v-list-item v-for="item in items" :key="item.title" link :to="item.href">
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from "vue";

interface MenuItem {
  title: string;
  icon: string;
  href: string;
}

export default Vue.extend({
  name: "HelloWorld",

  mounted: function () {
    this.items = [
      { title: "Home",        href: "/",              icon: "mdi-home" },
      { title: "Login",       href: "/login",         icon: "mdi-information" },
      { title: "Biblioteche", href: "/libraries",     icon: "mdi-office-building", },
      { title: "Utenti",      href: "/users",         icon: "mdi-account-group", },
      { title: "Tipi Record", href: "/record-types",  icon: "mdi-rhombus-split", },
    ];
  },

  data: () => ({
    items: [] as MenuItem[]
  }),
});
</script>
