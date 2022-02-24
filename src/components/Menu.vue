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
import userService from '@/services/user.service';
import { Role } from '@/common/enums'

interface MenuItem {
  title: string;
  icon: string;
  role: number;
  href: string;
}

const menuItems: MenuItem[] = [
  { title: "Aggiungi Record", href: "/add-records",      role: Role.User,   icon: "mdi-plus-box", },
  { title: "Non Conformitá",  href: "/non-compliances",  role: Role.User,   icon: "mdi-bookmark-remove", },
  { title: "Utenti",          href: "/users",            role: Role.Admin,  icon: "mdi-account-group", },
  { title: "Biblioteche",     href: "/libraries",        role: Role.Admin,  icon: "mdi-office-building", },
  { title: "Tipi Record",     href: "/record-types",     role: Role.Admin,  icon: "mdi-rhombus-split", },
  { title: "Tag",             href: "/tags",             role: Role.User,   icon: "mdi-tag", },
]

export default Vue.extend({
  name: "Menu",

  computed: {
    items: function () {
      const user = userService.getUser();
      if (!user) return [];

      return menuItems.filter(i => i.role <= user.role);
    }
  },
});
</script>
