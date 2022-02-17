<template>
  <crud-table :title="'Librerie'" :headers="headers" :items="libraries" :defaultItem="defaultItem">
    <slot name="edit-form">
      <v-row>
        <v-col cols="12" sm="3" md="3">
          <v-text-field label="Codice"></v-text-field>
        </v-col>
        <v-col cols="12" sm="9" md="9">
          <v-text-field label="Nome"></v-text-field>
        </v-col>
      </v-row>
    </slot>
  </crud-table>
</template>

<script lang="ts">
import { LibraryDTO } from '@/types/dto';
import Vue from "vue";
import apiService from '../services/api.service';
import CrudTable from '../components/CrudTable.vue';

export default Vue.extend({
  name: "Libraries",
  components: { CrudTable },

  data: () => ({
    headers: [
      { text: 'Codice', value: 'code', width: '25%' },
      { text: 'Nome', value: 'name', width: '75%' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    libraries: [] as LibraryDTO[],
    defaultItem: {
      code: '',
      name: '',
    } as LibraryDTO,
  }),

  async created () {
    this.libraries = await apiService.libraries.getAll();
  },

  methods: {

    async add(l: LibraryDTO, done: () => void) {
        await apiService.libraries.add(l);
        this.libraries.push(l);
        done();
    },

    async update(id: string, l: LibraryDTO, done: () => void) {
        await apiService.libraries.patch(id, l);
        const i = this.libraries.findIndex(x => x.code === id)
        Object.assign(this.libraries[i], l);
        done();
    },

    async delete(id: string, done: () => void) {
        await apiService.libraries.delete(id);
        const i = this.libraries.findIndex(x => x.code === id)
        this.libraries.splice(i, 1);
        done();
    },

  },
});
</script>