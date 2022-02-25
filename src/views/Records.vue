<template>
  <crud-table
    title="Ultimi record inseriti"
    :headers="headers"
    :items="records"
    :addButton="false"
    :loading="loading"
    @update="update($event.id, $event.item, $event.done)"
    @remove="remove($event.id, $event.done)"
  >
    <template v-slot:edit-form="slotProps">
      <record-form
        :editedItem="slotProps.editedItem"
        :types="types" :founds="founds" :formats="formats" :libraries="libraries"
      />
    </template>
  </crud-table>
</template>

<script lang="ts">
import { RecordDTO } from '@/types/dto';
import Vue from "vue";
import apiService from '@/services/api.service';
import CrudTable from '@/components/CrudTable.vue';
import RecordForm from '@/components/forms/RecordForm.vue';
import { SelectOption } from '@/common/types';

export default Vue.extend({
  name: "AddRecords",
  components: { CrudTable, RecordForm },

  data: () => ({
    loading: true,
    isAddFormValid: false,
    headers: [
      { text: 'Id', value: 'id' },
      { text: 'Autore', value: 'authorName' },
      { text: 'Biblioteca', value: 'libraryName' },
      { text: 'Formato', value: 'formatName' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    records: [] as RecordDTO[],
    types: [] as string[],
    founds: [] as string[],
    formats: [] as SelectOption[],
    libraries: [] as SelectOption[],
    addingItem: {
      libraryId: 0,
      formatId: 0,
      number: 0,
      fly: false,
      recordType: '',
      authorName: '',
    } as RecordDTO,
  }),

  async created () {
    [ 
      this.records,
      this.types,
      this.founds,
      this.formats,
      this.libraries,
    ] = await Promise.all([
      apiService.records.getMine(),
      apiService.records.getTypes(),
      apiService.records.getFounds(),
      apiService.formats.getAll().then(fs => fs.map(f => ({ value: f.id ?? -1, text: f.name }))),
      apiService.libraries.getAll().then(ls => ls.map(l => ({ value: l.id ?? -1, text: l.name }))),
    ]);
    this.loading = false;
  },

  methods: {

    fillMissingProps(r: RecordDTO) {
      r.libraryName = this.libraries.find(l => l.value === r.libraryId)?.text ?? '';
      r.formatName = this.formats.find(f => f.value === r.formatId)?.text ?? '';
    },

    async add() {
      if (!this.isAddFormValid) return;

      const id = await apiService.records.add(this.addingItem);
      this.records.push({ id, ...this.addingItem });
      this.addingItem = {
        libraryId: 0,
        formatId: 0,
        number: 0,
        fly: false,
        recordType: '',
        authorName: '',
      } as RecordDTO;
    },

    async update(id: number, r: RecordDTO, done: () => void) {
      await apiService.records.update(id, r);
      this.fillMissingProps(r);
      done();
    },

    async remove(id: number, done: () => void) {
      await apiService.nonCompliances.delete(id);
      done();
    },

  },
});
</script>