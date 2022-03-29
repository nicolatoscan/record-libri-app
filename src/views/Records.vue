<template>
  <crud-table
    title="Record"
    :headers="headers"
    :items="records"
    :loading="loading"
    :filters="true"
    :reaadonlyTable="isCommitente"
    @update="update($event.id, $event.item, $event.done)"
    @remove="remove($event.id, $event.done)"
  >
    <template v-slot:activator>
      <div></div>
    </template>
    <template v-slot:filter-form>
      <v-card outlined class="pa-5 ma-2">
        <v-row justify="center" align="center">
          <v-col cols="4" md="4" sm="6">
            <v-select label="Catalogatore" :items="users" v-model="filters.userId" :disabled="!isAdmin && !isCommitente"></v-select>
          </v-col>
          <v-col cols="4" md="4" sm="6">
            <v-select label="Biblioteca" :items="libraries" v-model="filters.libraryId" :disabled="isCommitente"></v-select>
          </v-col>
          <v-col cols="2" md="2" sm="6">
            <DatePicker v-model="filters.dateStart" label="Data inizio" />
          </v-col>
          <v-col cols="2" md="2" sm="6">
            <DatePicker v-model="filters.dateEnd" label="Data fine" />
          </v-col>
        </v-row>
        <v-row justify="end" align="center">
          <v-col cols="3" v-if="isAdmin">
            <v-btn color="primary darken-4" dark block @click="print()" :disabled="loading || !printable">
              <v-icon left dark>mdi-printer</v-icon>
              Stampa risultati
            </v-btn>
          </v-col>
          <v-spacer />
          <v-col cols="3">
            <v-btn color="primary" text block outlined @click="reset()" :disabled="loading">
              <v-icon left dark>mdi-close</v-icon>
              Annulla ricerca
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn color="primary" block @click="applyFilter()" :disabled="loading">
              <v-icon left dark>mdi-magnify</v-icon>
              Cerca
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
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
import printsService from '@/services/prints.service';
import userService from '@/services/user.service'
import { Role } from '@/common/enums';

export default Vue.extend({
  name: "Records",
  components: { CrudTable, RecordForm, DatePicker },

  data: () => ({
    date: null as string | null,
    loading: true,
    isAddFormValid: false,
    printable: false,
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
      libraryId: null as number | null,
      dateStart: null as string | null,
      dateEnd: null as string | null,
    },
    records: [] as RecordDTO[],
    types: [] as string[],
    founds: [] as string[],
    formats: [] as SelectOption[],
    libraries: [] as SelectOption[],
    users: [] as SelectOption[],
    isCommitente: false,
    isAdmin: false,
  }),

  async created () {
    const user = userService.getUser();
    this.isCommitente = (!!user?.role && user.role === Role.Commitente);
    this.isAdmin = (!!user?.role && user.role >= Role.Admin);
    if (this.isCommitente) {
      this.headers.pop();
    }
    [ 
      this.types,
      this.founds,
      this.formats,
      this.libraries,
      this.users
    ] = await Promise.all([
      apiService.records.getTypes(),
      apiService.records.getFounds(),
      apiService.formats.getAll().then(fs => fs.map(f => ({ value: f.id ?? -1, text: f.name }))),
      apiService.libraries.getAll().then(ls => ls.map(l => ({ value: l.id ?? -1, text: l.name }))),
      apiService.users.getAll().then(us => us.map(u => ({ value: u.id ?? -1, text: u.username }))),
    ]);
    this.libraries.unshift({ value: null, text: 'Tutte' });
    this.users.unshift({ value: null, text: 'Tutti' });
    this.loading = false;

    if (this.isCommitente) {
      this.filters.libraryId = user?.libraryId ?? null;
      console.log(this.filters.libraryId);
    } else {
      this.filters.userId = user?.id ?? null;
    }

    await this.applyFilter();
  },

  methods: {

    fillMissingProps(r: RecordDTO): RecordDTO {
      r.libraryName = this.libraries.find(l => l.value === r.libraryId)?.text ?? '';
      r.formatName = this.formats.find(f => f.value === r.formatId)?.text ?? '';
      return r;
    },

    async reset() {
      this.filters = {
        userId: null,
        libraryId: null,
        dateStart: null,
        dateEnd: null,
      };
      await this.applyFilter();
    },

    async applyFilter() {
      this.printable = false;
      this.loading = true;
      this.records = [];
      const libraryId = this.filters.libraryId ?? undefined;
      this.records = await apiService.records.getFiltered({
        startDate: this.filters.dateStart ?? undefined,
        endDate: this.filters.dateEnd ?? undefined,
        userId: this.filters.userId ?? undefined,
        libraryId: libraryId,
      });
      this.loading = false;
      this.printable = !!libraryId;
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

    print() {
      const library = this.libraries.find(l => l.value === this.filters.libraryId)?.text ?? null;
      const dateStart = this.filters.dateStart ? new Date(this.filters.dateStart) : this.records.map(r => new Date(r.dateAdded)).reduce((a, b) => a < b ? a : b, new Date());
      const dateEnd = this.filters.dateEnd ? new Date(this.filters.dateEnd) : new Date();

      if (library) {
        printsService.print(library, dateStart, dateEnd, this.records.map(r => ({ ...r })));
      }
    }

  },
});
</script>