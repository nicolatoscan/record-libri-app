<template>
  <crud-table
      title="Tipologie Record"
      :headers="headers"
      :items="types"
      :defaultItem="defaultItem"
      @add="add($event.item, $event.done)"
      @update="update($event.id, $event.item, $event.done)"
      @remove="remove($event.id, $event.done)"
  >
    <template v-slot:edit-form="slotProps">
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-text-field
            label="Nome"
            v-model="slotProps.editedItem.name" 
          ></v-text-field>
        </v-col>
      </v-row>
    </template>
  </crud-table>
</template>

<script lang="ts">
import { RecordTypeDTO } from '@/types/dto';
import Vue from "vue";
import apiService from '@/services/api.service';
import CrudTable from '@/components/CrudTable.vue';

export default Vue.extend({
  name: "RecordTypes",
  components: { CrudTable },

  data: () => ({
    headers: [
      { text: 'Id', value: 'id', width: '25%' },
      { text: 'Nome', value: 'name', width: '75%' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    types: [] as RecordTypeDTO[],
    defaultItem: {
      name: '',
    } as RecordTypeDTO,
  }),

  async created () {
    this.types = await apiService.recordTypes.getAll();
  },

  methods: {

    async add(t: RecordTypeDTO, done: () => void) {
        t.id = await apiService.recordTypes.add(t);
        this.types.push(t);
        done();
    },

    async update(id: number, t: RecordTypeDTO, done: () => void) {
        await apiService.recordTypes.update(id, t);
        const i = this.types.findIndex(x => x.id === id)
        Object.assign(this.types[i], t);
        done();
    },

    async remove(id: number, done: () => void) {
        await apiService.recordTypes.delete(id);
        const i = this.types.findIndex(x => x.id === id)
        this.types.splice(i, 1);
        done();
    },

  },
});
</script>