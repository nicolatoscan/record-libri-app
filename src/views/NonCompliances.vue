<template>
  <crud-table
      title="Non Conformitá"
      :headers="headers"
      :items="ncs"
      :defaultItem="defaultItem"
      :loading="loading"
      :filters="true"
      @add="add($event.item, $event.done)"
      @update="update($event.id, $event.item, $event.done)"
      @remove="remove($event.id, $event.done)"
  >
    <template v-slot:filter-form>
      <v-switch :disabled="loading" :value="true" label="Mostra solo anno corrente" @change="onlyYearChanged"></v-switch>
    </template>
    <template v-slot:edit-form="slotProps">
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-autocomplete
            label="Numero record"
            :items="records"
            v-model="slotProps.editedItem.recordId"
            :rules="recordRules"
          ></v-autocomplete>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6" sm="12" md="6">
          <v-select
            label="Catalogatore"
            :items="users"
            v-model="slotProps.editedItem.userId"
            :rules="userRules"
          ></v-select>
        </v-col>
        <v-col cols="6" sm="12" md="6">
          <v-select
            label="Biblioteca"
            :items="libraries"
            v-model="slotProps.editedItem.libraryId"
            :rules="libraryRules"
          ></v-select>
        </v-col>

        <v-col cols="4" sm="12" md="4">
          <v-select
            label="Lingua"
            :items="languages"
            v-model="slotProps.editedItem.language"
            :rules="languageRules"
          ></v-select>
        </v-col>
        <v-col cols="4" sm="12" md="4">
          <v-select
            label="Formato"
            :items="formats"
            v-model="slotProps.editedItem.formatId"
            :rules="formatRules"
          ></v-select>
        </v-col>
        <v-col cols="4" sm="12" md="4">
          <v-select
            label="Tag"
            :items="tags"
            v-model="slotProps.editedItem.tagId"
            :rules="tagRules"
          ></v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card outlined class="pa-3">
            <h3 class=" d-flex justify-center">Gruppo:</h3>
            <v-radio-group row
              v-model="slotProps.editedItem.group"
              :rules="groupRules"
            >
              <v-radio v-for="g in groups" :key="g" :label="g" :value="g" ></v-radio>
            </v-radio-group>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-textarea
            label="Description"
            v-model="slotProps.editedItem.description"
            :rules="descriptionRules"
            :counter="10000"
          ></v-textarea>
        </v-col>
      </v-row>

    </template>
  </crud-table>
</template>

<script lang="ts">
import { NonCompliancesDTO } from '@/types/dto';
import Vue from "vue";
import apiService from '@/services/api.service';
import CrudTable from '@/components/CrudTable.vue';
import rules from '@/common/form-rules';
import { SelectOption } from '@/common/types';

export default Vue.extend({
  name: "NonCompliances",
  components: { CrudTable },

  data: () => ({
    loading: true,
    headers: [
      { text: 'Id', value: 'id' },
      { text: 'Record', value: 'recordNumber' },
      { text: 'Utente', value: 'username' },
      { text: 'Biblioteca', value: 'libraryName' },
      { text: 'Lingua', value: 'language' },
      { text: 'Tipo', value: 'formatName' },
      { text: 'Tag', value: 'tagName' },
      { text: 'Descrizione', value: 'description' },
      { text: 'Data', value: 'dateAdded', itemTextHandler: (x: Date) => new Date(x).toLocaleDateString() },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    
    ncs: [] as NonCompliancesDTO[],

    records: [] as SelectOption[],
    users: [] as SelectOption[],
    libraries: [] as SelectOption[],
    formats: [] as SelectOption[],
    tags: [] as SelectOption[],
    groups: [] as string[],
    languages: [] as string[],

    defaultItem: {
      recordId: 0,
      userId: 0,
      libraryId: 0,
      formatId: 0,
      tagId: 0,
      group: '',
      language: '',
      description: '',
    } as NonCompliancesDTO,

    recordRules: [ rules.notEmpty('Seleziona un record') ],
    userRules: [ rules.notEmpty('Seleziona un catalogatore') ],
    libraryRules: [ rules.notEmpty('Seleziona una bibliotecac') ],
    languageRules: [ rules.notEmpty('Seleziona una lingua') ],
    formatRules: [ rules.notEmpty('Seleziona un tipo') ],
    tagRules: [ rules.notEmpty('Seleziona un tag') ],
    groupRules: [ rules.notEmpty('Seleziona un gruppo') ],
    descriptionRules: [ rules.notEmpty('Aggiungi una descrizione'), rules.length(10000) ],
  }),

  async created () {
    [
      this.ncs,
      this.records,
      this.users,
      this.libraries,
      this.formats,
      this.tags,
      this.groups,
      this.languages
    ] = await Promise.all([
      apiService.nonCompliances.getThisYear(),
      apiService.records.getNumbers().then(rs => rs.map(r => ({ value: r.id ?? -1, text: r.number.toString() }))),
      apiService.users.getAll().then(us => us.map(u => ({ value: u.id ?? -1, text: u.username }))),
      apiService.libraries.getAll().then(ls => ls.map(l => ({ value: l.id ?? -1, text: l.name }))),
      apiService.formats.getAll().then(fs => fs.map(f => ({ value: f.id ?? -1, text: f.name }))),
      apiService.tags.getAll().then(ts => ts.map(t => ({ value: t.id ?? -1, text: t.name }))),
      apiService.nonCompliances.getGroups(),
      apiService.nonCompliances.getLanguages(),
    ]);
    this.loading = false;
  },

  methods: {

    async onlyYearChanged(thisYear: boolean | null) {
      this.loading = true;
      this.ncs = thisYear ? await apiService.nonCompliances.getThisYear() : await apiService.nonCompliances.getAll();
      this.loading = false;
    },

    fillMissingProps(nc: NonCompliancesDTO) {
      nc.recordNumber = +(this.records.find(r => r.value === nc.recordId)?.text ?? '');
      nc.libraryName = this.libraries.find(l => l.value === nc.libraryId)?.text ?? '';
      nc.formatName = this.formats.find(r => r.value === nc.formatId)?.text ?? '';
      nc.tagName = this.tags.find(t => t.value === nc.tagId)?.text ?? '';
      nc.username = this.users.find(u => u.value === nc.userId)?.text ?? '';
      nc.dateAdded = new Date();
    },

    async add(nc: NonCompliancesDTO, done: () => void) {
      nc.id = await apiService.nonCompliances.add(nc);
      this.fillMissingProps(nc);
      done();
    },

    async update(id: number, nc: NonCompliancesDTO, done: () => void) {
      await apiService.nonCompliances.update(id, nc);
      this.fillMissingProps(nc);
      done();
    },

    async remove(id: number, done: () => void) {
      await apiService.nonCompliances.delete(id);
      done();
    },

  },
});
</script>