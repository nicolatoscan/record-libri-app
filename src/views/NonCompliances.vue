<template>
  <crud-table
      title="Non Conformitá"
      :headers="headers"
      :items="ncs"
      :defaultItem="defaultItem"
      :loading="loading"
      @add="add($event.item, $event.done)"
      @update="update($event.id, $event.item, $event.done)"
      @remove="remove($event.id, $event.done)"
  >
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
            label="Tipo record"
            :items="recordTypes"
            v-model="slotProps.editedItem.recordTypeId"
            :rules="recordTypeRules"
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
      { text: 'Biblioteca', value: 'libraryName' },
      { text: 'Lingua', value: 'language' },
      { text: 'Lingua', value: 'language' },
      { text: 'Tipo', value: 'recordTypeName' },
      { text: 'Tag', value: 'tagName' },
      { text: 'Descrizione', value: 'description' },
      { text: 'Data', value: 'dateRecord', itemTextHandler: (x: Date) => new Date(x).toLocaleDateString() },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    
    ncs: [] as NonCompliancesDTO[],

    records: [] as SelectOption[],
    users: [] as SelectOption[],
    libraries: [] as SelectOption[],
    recordTypes: [] as SelectOption[],
    tags: [] as SelectOption[],
    groups: [] as string[],
    languages: [] as string[],

    defaultItem: {
      recordId: 0,
      userId: 0,
      libraryId: 0,
      recordTypeId: 0,
      tagId: 0,
      group: '',
      language: '',
      description: '',
    } as NonCompliancesDTO,

    recordRules: [ rules.notEmpty('Seleziona un record') ],
    userRules: [ rules.notEmpty('Seleziona un catalogatore') ],
    libraryRules: [ rules.notEmpty('Seleziona una bibliotecac') ],
    languageRules: [ rules.notEmpty('Seleziona una lingua') ],
    recordTypeRules: [ rules.notEmpty('Seleziona un tipo') ],
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
      this.recordTypes,
      this.tags,
      this.groups,
      this.languages
    ] = await Promise.all([
      apiService.nonCompliances.getAll(),
      apiService.records.getNumbers().then(rs => rs.map(r => ({ value: r.id ?? -1, text: r.number.toString() }))),
      apiService.users.getAll().then(us => us.map(u => ({ value: u.id ?? -1, text: u.username }))),
      apiService.libraries.getAll().then(ls => ls.map(l => ({ value: l.id ?? -1, text: l.name }))),
      apiService.recordTypes.getAll().then(rs => rs.map(r => ({ value: r.id ?? -1, text: r.name }))),
      apiService.tags.getAll().then(ts => ts.map(t => ({ value: t.id ?? -1, text: t.name }))),
      apiService.nonCompliances.getGroups(),
      apiService.nonCompliances.getLanguages(),
    ]);
    this.loading = false;
  },

  methods: {

    async add(nc: NonCompliancesDTO, done: () => void) {
      console.log(nc);
      nc.id = await apiService.nonCompliances.add(nc);
      this.ncs.push(nc);
      done();
    },

    async update(id: number, nc: NonCompliancesDTO, done: () => void) {
      await apiService.nonCompliances.update(id, nc);
      const i = this.ncs.findIndex(x => x.id === id)
      Object.assign(this.ncs[i], nc);
      done();
    },

    async remove(id: number, done: () => void) {
      await apiService.nonCompliances.delete(id);
      const i = this.ncs.findIndex(x => x.id === id)
      this.ncs.splice(i, 1);
      done();
    },

  },
});
</script>