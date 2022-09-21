<template>
  <crud-table
      title="Biblioteche"
      :headers="headers"
      :items="libraries"
      :defaultItem="defaultItem"
      :loading="loading"
      @add="add($event.item, $event.done)"
      @update="update($event.id, $event.item, $event.done)"
      @remove="remove($event.id, $event.done)"
  >
    <template v-slot:edit-form="slotProps">
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-text-field
            autofocus
            label="Nome"
            v-model="slotProps.editedItem.name" 
            :rules="nameRules"
            :counter="100"
          ></v-text-field>
        </v-col>
      </v-row>
    </template>
  </crud-table>
</template>

<script lang="ts">
import { LibraryDTO } from '@/types/dto';
import Vue from "vue";
import apiService from '@/services/api.service';
import CrudTable from '@/components/CrudTable.vue';
import rules from  '@/common/form-rules'

export default Vue.extend({
  name: "Libraries",
  components: { CrudTable },

  data: () => ({
    loading: true,
    headers: [
      { text: 'Id', value: 'id', width: '15%' },
      { text: 'Nome', value: 'name', width: '85%' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    libraries: [] as LibraryDTO[],
    defaultItem: {
      name: '',
    } as LibraryDTO,
    nameRules: [ rules.notEmpty(), rules.length(100) ],
  }),

  async created () {
    this.libraries = await apiService.libraries.getAll();
    this.loading = false;
  },

  methods: {

    async add(l: LibraryDTO, done: () => void) {
      const res = await apiService.libraries.add(l);
      l.id = res;
      done();
    },

    async update(id: number, l: LibraryDTO, done: () => void) {
        await apiService.libraries.update(id, l);
        done();
    },

    async remove(id: number, done: () => void) {
        await apiService.libraries.delete(id);
        done();
    },

  },
});
</script>