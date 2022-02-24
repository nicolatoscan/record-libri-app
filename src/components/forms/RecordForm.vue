<template>
  <div>
    <v-row class="mx-12">
      <v-col cols="2" sm="3" md="2">
        <v-checkbox
          label="Authority"
          v-model="editedItem.isAuthority"
        ></v-checkbox>
      </v-col>
      <v-col cols="5" sm="9" md="5">
        <v-text-field
          label="Nome dell'autore"
          v-model="editedItem.authorName"
        ></v-text-field>
      </v-col>
      <v-col cols="5" sm="12" md="5">
        <v-text-field
          label="Numero"
          v-model="editedItem.number"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row class="mx-12">
      <v-col cols="2" sm="4" md="2">
        <v-checkbox
          label="è fly - libero"
          v-model="editedItem.fly"
        ></v-checkbox>
      </v-col>
      <v-col cols="5" sm="8" md="5">
        <v-select
          label="Biblioteca"
          :items="libraries"
          v-model="editedItem.libraryId"
        ></v-select>
      </v-col>
      <v-col cols="5" sm="12" md="5">
        <v-select
          label="Formato"
          :items="formats"
          v-model="editedItem.formatId"
        ></v-select>
      </v-col>
    </v-row>

    <v-row class="mx-12">
      <v-col cols="6">
        <v-checkbox
          label="UNI Inglese"
          v-model="editedItem.englishUNI"
        ></v-checkbox>
      </v-col>
    </v-row>

    <v-row class="mx-12">
      <v-col cols="6">
        <v-card outlined class="pa-3">
          <h3 class=" d-flex justify-center">Tipo di record:</h3>
          <v-radio-group v-model="editedItem.recordType" row>
            <v-radio v-for="t in types" :key="t" :label="t" :value="t" ></v-radio>
          </v-radio-group>
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card outlined class="pa-3">
          <h3 class=" d-flex justify-center">Fondo F. Museo Civico:</h3>
          <v-radio-group v-model="editedItem.found" row>
            <v-radio v-for="f in founds" :key="f" :label="f" :value="f" ></v-radio>
          </v-radio-group>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "RecordForm",

  props: {
    editedItem: Object,
    types: Array,
    founds: Array,
    formats: Array,
    libraries: Array
  }
});
</script>
