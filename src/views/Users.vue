<template>
  <crud-table
      title="Utenti"
      :headers="headers"
      :items="users"
      :defaultItem="defaultItem"
      @add="add($event.item, $event.done)"
      @update="update($event.id, $event.item, $event.done)"
      @remove="remove($event.id, $event.done)"
  >
    <template v-slot:edit-form="slotProps">
      {{slotProps.editedItem}}
      <v-row>
        <v-col cols="12" sm="9" md="9">
          <v-text-field
            label="Username"
            v-model="slotProps.editedItem.username" 
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="3" md="3">
          <v-select
            label="Ruolo"
            :items="roles"
            v-model="slotProps.editedItem.role"
          ></v-select>
        </v-col>
      </v-row>
    </template>
  </crud-table>
</template>

<script lang="ts">
import { UserDTO } from '@/types/dto';
import Vue from "vue";
import apiService from '../services/api.service';
import CrudTable from '../components/CrudTable.vue';
import { SelectOption } from '../common/types';

let rolesDic = {} as { [key: number]: string };

export default Vue.extend({
  name: "Users",
  components: { CrudTable },

  data: () => {
    return {
      headers: [
        { text: 'Id', value: 'id', width: '10%' },
        { text: 'Username', value: 'username', width: '40%' },
        { text: 'Role', value: 'role', width: '40%', itemTextHandler: (x: number) => rolesDic[x] },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      users: [] as UserDTO[],
      roles: [] as SelectOption[],
      defaultItem: {
        id: -1,
        username: '',
        role: 0,
      } as UserDTO,
    }
  },

  async created () {
    const rr = await apiService.users.getRoles();
    rolesDic = Object.fromEntries(Object.entries(rr).map(a => a.reverse()))
    this.roles = Object.keys(rr).map(k => ({ text: k, value: rr[k] }));
    this.users = await apiService.users.getAll();
  },

  methods: {


    formatUser(u: UserDTO) {
      return {
        id: u.id,
        username: u.username,
        role: u.role,
      }
    },


    async add(u: UserDTO, done: () => void) {
        await apiService.users.add(u);
        this.users.push(u);
        done();
    },

    async update(id: number, u: UserDTO, done: () => void) {
        await apiService.users.update(id, {
          username: u.username,
          role: u.role,
        });
        const i = this.users.findIndex(x => x.id === id);
        Object.assign(this.users[i], u);
        done();
    },

    async remove(id: number, done: () => void) {
        await apiService.libraries.delete(id);
        const i = this.users.findIndex(x => x.id === id)
        this.users.splice(i, 1);
        done();
    },

  },
});
</script>