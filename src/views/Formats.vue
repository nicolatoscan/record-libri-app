<template>
  <crud-table
    title="Formati"
    :headers="headers"
    :items="types"
    :defaultItem="defaultItem"
    :loading="loading"
    @add="add($event.item, $event.done, $event.fail)"
    @update="update($event.id, $event.item, $event.done, $event.fail)"
    @remove="remove($event.id, $event.done, $event.fail)"
  >
    <template v-slot:edit-form="slotProps">
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-text-field
            label="Nome"
            v-model="slotProps.editedItem.name"
            :rules="nameRules" :counter="50"
          ></v-text-field>
        </v-col>
      </v-row>
    </template>
  </crud-table>
</template>

<script lang="ts">
import { FormatDTO } from '@/types/dto';
import Vue from "vue";
import apiService from '@/services/api.service';
import CrudTable from '@/components/CrudTable.vue';
import rules from '@/common/form-rules';

export default Vue.extend({
  name: "Formats",
  components: { CrudTable },

  data: () => ({
    loading: true,
    headers: [
      { text: 'Id', value: 'id', width: '25%' },
      { text: 'Nome', value: 'name', width: '75%' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    types: [] as FormatDTO[],
    defaultItem: {
      name: '',
    } as FormatDTO,
    nameRules: [ rules.length(50) ],
  }),

  async created () {
    this.types = await apiService.formats.getAll();
    this.loading = false;
  },

  methods: {

    async add(t: FormatDTO, done: () => void, fail: (msg: string) => void) {
      try {
        t.id = await apiService.formats.add(t);
      } catch (e) {
        return fail('CIAO');
      }
      done();
    },

    async update(id: number, t: FormatDTO, done: () => void, fail: (msg: string) => void) {
      try {
        await apiService.formats.update(id, t);
      } catch (e) {
        return fail('CIAO');
      }
      done();
    },

    async remove(id: number, done: () => void, fail: (msg: string) => void) {
      try {
        await apiService.formats.delete(id);
      } catch (e) {
        return fail('CIAO');
      }
      done();
    },

  },
});
</script>