<template>
  <crud-table
    title="Record"
    :headers="headers"
    :items="records"
    :addButton="false"
    :loading="loading"
    :filters="true"
    @update="update($event.id, $event.item, $event.done)"
    @remove="remove($event.id, $event.done)"
  >
    <template v-slot:filter-form>
      <v-row class="mx-4" justify="center" align="center">
        <v-col cols="3" sm="6" md="3">
          <DatePicker v-model="filters.dateStart" label="Data inizio" />
        </v-col>
        <v-col cols="3" sm="6" md="3">
          <DatePicker v-model="filters.dateEnd" label="Data fine" />
        </v-col>
        <v-col cols="4" sm="9" md="4">
          <v-select label="Catalogatore" :items="users" v-model="filters.userId"></v-select>
        </v-col>
        <v-col cols="2" sm="3" md="2">
          <v-btn color="primary" @click="applyFilter()">Cerca</v-btn>
        </v-col>
      </v-row>
    </template>
    <template v-slot:edit-form="slotProps">
      <record-form
        :editedItem="slotProps.editedItem"
        :types="types" :founds="founds" :formats="formats" :libraries="libraries"
      />
    </template>
  </crud-table>
</template>

<script lang="ts">
import Vue from "vue";
import { RecordDTO } from '@/types/dto';
import apiService from '@/services/api.service';
import CrudTable from '@/components/CrudTable.vue';
import RecordForm from '@/components/forms/RecordForm.vue';
import { SelectOption } from '@/common/types';
import DatePicker from '@/components/inputs/DatePicker.vue'

export default Vue.extend({
  name: "Records",
  components: { CrudTable, RecordForm, DatePicker },

  data: () => ({
    date: null as string | null,
    loading: true,
    isAddFormValid: false,
    headers: [
      { text: 'Id', value: 'id', width: '10%' },
      { text: 'Numero', value: 'number' },
      { text: 'Biblioteca', value: 'libraryName' },
      { text: 'Formato', value: 'formatName' },
      { text: 'Tipo', value: 'recordType' },
      { text: 'Autore', value: 'authorName' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    filters: {
      userId: null as number | null,
      dateStart: null as string | null,
      dateEnd: null as string | null,
    },
    records: [] as RecordDTO[],
    types: [] as string[],
    founds: [] as string[],
    formats: [] as SelectOption[],
    libraries: [] as SelectOption[],
    users: [] as SelectOption[],
  }),

  async created () {
    [ 
      this.records,
      this.types,
      this.founds,
      this.formats,
      this.libraries,
      this.users
    ] = await Promise.all([
      apiService.records.getMine(),
      apiService.records.getTypes(),
      apiService.records.getFounds(),
      apiService.formats.getAll().then(fs => fs.map(f => ({ value: f.id ?? -1, text: f.name }))),
      apiService.libraries.getAll().then(ls => ls.map(l => ({ value: l.id ?? -1, text: l.name }))),
      apiService.users.getAll().then(us => us.map(u => ({ value: u.id ?? -1, text: u.username }))),
    ]);
    this.loading = false;
  },

  methods: {

    fillMissingProps(r: RecordDTO): RecordDTO {
      r.libraryName = this.libraries.find(l => l.value === r.libraryId)?.text ?? '';
      r.formatName = this.formats.find(f => f.value === r.formatId)?.text ?? '';
      return r;
    },

    async applyFilter() {
      this.records = await apiService.records.getFiltered({
        startDate: this.filters.dateStart ?? undefined,
        endDate: this.filters.dateEnd ?? undefined,
        userId: this.filters.userId ?? undefined
      });
    },

    async update(id: number, r: RecordDTO, done: () => void) {
      await apiService.records.update(id, r);
      this.fillMissingProps(r);
      done();
    },

    async remove(id: number, done: () => void) {
      await apiService.records.delete(id);
      done();
    },

  },
});
</script>