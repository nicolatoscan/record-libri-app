<template>
  <div>
    <v-col>
      <v-card class="mb-10 pb-5" :loading="loading">
        <v-toolbar dark color="primary">
          <v-toolbar-title class="flex text-center text-h5">Aggiungi Record</v-toolbar-title>
        </v-toolbar>

        <v-container>
          <v-form v-model="isAddFormValid"> 
            <record-form
              :editedItem="addingItem"
              :types="types" :founds="founds" :formats="formats" :libraries="libraries"
            />
          </v-form>
        </v-container>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="add" :disabled="!isAddFormValid">Aggiungi</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>

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
    </v-col>

    <v-snackbar :timeout="2000" v-model="success" tile color="green">Reccord aggiunto</v-snackbar>
    <v-snackbar :timeout="2000" v-model="error" tile color="red accent-2">Errore nell'aggiunta del record</v-snackbar>
  </div>
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
    error: false,
    success: false,
    loading: true,
    isAddFormValid: false,
    defaultFormat: 0,
    defaultFund: '',
    headers: [
      { text: 'Id', value: 'id', width: '10%' },
      { text: 'Numero', value: 'number' },
      { text: 'Biblioteca', value: 'libraryName' },
      { text: 'Formato', value: 'formatName' },
      { text: 'Tipo', value: 'recordType' },
      { text: 'Autore', value: 'authorName' },
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
      recordType: '',
      authorName: null,
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
    this.defaultFormat = this.formats.find(f => f.text.toLowerCase().includes('bk') || f.text.toLowerCase().includes('book') )?.value ?? 0;
    this.addingItem.recordType = this.types.indexOf('Nuovo') ? 'Nuovo' : this.types[0];
    this.defaultFund = this.founds.indexOf('Moderno') ? 'Moderno' : this.founds[0];
    this.addingItem.found = this.defaultFund;
    this.addingItem.formatId = this.defaultFormat;
    this.loading = false;
  },

  methods: {

    fillMissingProps(r: RecordDTO): RecordDTO {
      r.libraryName = this.libraries.find(l => l.value === r.libraryId)?.text ?? '';
      r.formatName = this.formats.find(f => f.value === r.formatId)?.text ?? '';
      return r;
    },

    async add() {
      if (!this.isAddFormValid) return;
      this.addingItem.number = +this.addingItem.number;
      const id = await apiService.records.add(this.addingItem);
      if (id) {
        this.success = true;
        this.records.push(this.fillMissingProps( { id, ...this.addingItem } ));

        this.addingItem = {
          number: 0,
          libraryId: this.addingItem.libraryId,
          formatId: this.defaultFormat,
          recordType: this.addingItem.recordType,
          authorName: '',
          found: this.defaultFund,
        } as RecordDTO;

      } else {
        this.error = true;
      }

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