<template>
  <v-col>
    <v-card class="mb-10 pb-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title class="flex text-center text-h5">Aggiungi Record</v-toolbar-title>
      </v-toolbar>

      <v-container>
        <v-row class="mx-12">
          <v-col cols="2" sm="3" md="2">
            <v-checkbox
              label="Authority"
              v-model="isAuthority"
            ></v-checkbox>
          </v-col>
          <v-col cols="5" sm="9" md="5">
            <v-text-field
              label="Nome dell'autore"
              v-model="addingItem.authorName"
            ></v-text-field>
          </v-col>
          <v-col cols="5" sm="12" md="5">
            <v-text-field
              label="Numero"
              v-model="addingItem.number"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row class="mx-12">
          <v-col cols="2" sm="4" md="2">
            <v-checkbox
              label="è fly - libero"
              v-model="addingItem.fly"
            ></v-checkbox>
          </v-col>
          <v-col cols="5" sm="8" md="5">
            <v-select
              label="Biblioteca"
              :items="libraries"
              v-model="addingItem.libraryId"
            ></v-select>
          </v-col>
          <v-col cols="5" sm="12" md="5">
            <v-select
              label="Tipo"
              :items="recordTypes"
              v-model="addingItem.typeId"
            ></v-select>
          </v-col>
        </v-row>

        <v-row class="mx-12">
          <v-col cols="6">
            <v-card outlined class="pa-3">
              <h3 class=" d-flex justify-center">Tipo di record:</h3>
              <v-radio-group v-model="addingItem.recordType" row>
                <v-radio v-for="t in types" :key="t" :label="t" :value="t" ></v-radio>
              </v-radio-group>
            </v-card>
          </v-col>

          <v-col cols="6">
            <v-card outlined class="pa-3">
              <h3 class=" d-flex justify-center">Tipo di record:</h3>
              <v-radio-group row>
                <v-radio label="Moderno"></v-radio>
                <v-radio label="Pregio"></v-radio>
                <v-radio label="Antico"></v-radio>
              </v-radio-group>
            </v-card>
          </v-col>
        </v-row>


      </v-container>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="add">Aggiungi</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>

    <crud-table
        title="Ultimi record inseriti"
        :headers="headers"
        :items="records"
        :addButton="false"
    >
    </crud-table>
  </v-col>
</template>

<script lang="ts">
import { RecordDTO, RecordTypeDTO, LibraryDTO } from '@/types/dto';
import Vue from "vue";
import apiService from '@/services/api.service';
import CrudTable from '@/components/CrudTable.vue';
import { SelectOption } from '@/common/types';

export default Vue.extend({
  name: "AddRecords",
  components: { CrudTable },

  data: () => ({
    headers: [
      { text: 'Id', value: 'id', width: '10%' },
      { text: 'Autore', value: 'authorName', width: '90%' },
    ],
    records: [] as RecordDTO[],
    types: [] as string[],
    recordTypes: [] as SelectOption[],
    libraries: [] as SelectOption[],
    isAuthority: false,
    addingItem: {
      libraryId: 0,
      typeId: 0,
      number: 0,
      fly: false,
      recordType: '',
      authorName: '',
    } as RecordDTO,
  }),

  async created () {
    let allLibraries: LibraryDTO[] = [];
    let allRecordTypes: RecordTypeDTO[] = [];
    [ 
      this.records,
      this.types,
      allRecordTypes,
      allLibraries
    ] = await Promise.all([
      apiService.records.getMine(),
      apiService.records.getTypes(),
      apiService.recordTypes.getAll(),
      apiService.libraries.getAll(),
    ])

    this.libraries = allLibraries.map(l => ({ value: l.id ?? -1, text: l.name }));
    this.recordTypes = allRecordTypes.map(t => ({ value: t.id ?? -1, text: t.name }));
  },

  methods: {

    async add() {
      const id = await apiService.records.add(this.addingItem);
      this.records.push({ id, ...this.addingItem });
      this.addingItem = {
        libraryId: 0,
        typeId: 0,
        number: 0,
        fly: false,
        recordType: '',
        authorName: '',
      } as RecordDTO;
    },

  },
});
</script>