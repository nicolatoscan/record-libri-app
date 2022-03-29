<template>
  <crud-table
      title="Utenti"
      :headers="headers"
      :items="users"
      :defaultItem="defaultItem"
      :loading="loading"
      @add="add($event.item, $event.done)"
      @update="update($event.id, $event.item, $event.done)"
      @remove="remove($event.id, $event.done)"
  >
    <template v-slot:edit-form="slotProps">

      <v-row>
        <v-col cols="12" sm="8" md="8">
          <v-text-field
            label="Username"
            v-model="slotProps.editedItem.username"
            :rules="usernameRules" :counter="120" required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-select
            label="Ruolo"
            :items="roles"
            v-model="slotProps.editedItem.role"
            :rules="roleRules" required
          ></v-select>
        </v-col>
      </v-row>

      <v-row v-if="commitenteRole === slotProps.editedItem.role">
        <v-col cols="12" sm="12" md="12">
          <v-select
            label="Libreria del commitente"
            :items="libraries"
            v-model="slotProps.editedItem.libraryId"
            :rules="libraryRule" required
          ></v-select>
        </v-col>
      </v-row>

      <v-row v-if="slotProps.editedId !== null">
        <v-col>
          <v-checkbox
            v-model="updatePassword"
            label="Aggiorna la password"
            color="primary">
          </v-checkbox>
        </v-col>
      </v-row>

      <v-row v-if="slotProps.editedId === null || updatePassword">
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            label="Password"
            v-model="slotProps.editedItem.password"
            :rules="passwordRules"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            label="Conferma Password"
            :rules="[ v => (v && v === slotProps.editedItem.password) || 'Le password non coincidono' ]"
          ></v-text-field>
        </v-col>
      </v-row>

    </template>
  </crud-table>
</template>

<script lang="ts">
import { UserDTO } from '@/types/dto';
import Vue from "vue";
import apiService from '@/services/api.service';
import CrudTable from '@/components/CrudTable.vue';
import { SelectOption } from '@/common/types';
import rules from '@/common/form-rules';
import { Role } from '@/common/enums';

let rolesDic = {} as { [key: number]: string };

export default Vue.extend({
  name: "Users",
  components: { CrudTable },

  data: () => {
    return {
      commitenteRole: Role.Commitente,
      loading: true,
      headers: [
        { text: 'Id', value: 'id', width: '10%' },
        { text: 'Username', value: 'username', width: '40%' },
        { text: 'Role', value: 'role', width: '40%', itemTextHandler: (x: number) => rolesDic[x] },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      users: [] as UserDTO[],
      roles: [] as SelectOption[],
      libraries: [] as SelectOption[],
      defaultItem: {
        id: -1,
        username: '',
        role: 0,
      } as UserDTO,
      updatePassword: false,
      usernameRules: [ rules.length(120) ],
      roleRules: [ rules.notEmpty() ],
      libraryRule: [ rules.notEmpty() ],
      passwordRules: [ rules.length(120, 8, 'La password deve essere di almeno 8 caratteri') ],
    }
  },

  async created () {
    [
      this.roles,
      this.libraries,
      this.users
    ] = await Promise.all([
      apiService.users.getRoles().then(rr => {
        rolesDic = Object.fromEntries(Object.entries(rr).map(a => a.reverse()))
        return Object.keys(rr).map(k => ({ text: k, value: rr[k] }));
      }),
      apiService.libraries.getAll().then(l => l.map(l => ({ text: l.name, value: l.id ?? -1 }))),
      apiService.users.getAll()
    ]);
    this.loading = false;
  },

  methods: {

    formatUser(u: UserDTO) {
      return {
        id: u.id,
        username: u.username,
        role: u.role,
        libraryId: u.libraryId,
      }
    },

    async add(u: UserDTO, done: () => void) {
      if (u.role !== Role.Commitente) delete u.libraryId;

      u.id = await apiService.users.add(u);
      done();
    },

    async update(id: number, u: UserDTO, done: () => void) {
      if (u.role !== Role.Commitente) delete u.libraryId;

      await apiService.users.update(id, {
        username: u.username,
        role: u.role,
        ...(this.updatePassword ? { password: u.password } : {})
      });
      done();
    },

    async remove(id: number, done: () => void) {
      await apiService.libraries.delete(id);
      done();
    },

  },
});
</script>