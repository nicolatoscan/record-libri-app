<template>
  <div>
    <v-row class="mx-12">
      <v-col cols="6" sm="12" md="6">
        <v-text-field
          autofocus
          label="Numero"
          v-model="editedItem.number"
          :rules="numberRules"
          type="number"
          ref="toFocus"
        ></v-text-field>
      </v-col>
      <v-col cols="6" sm="12" md="6">
        <v-autocomplete
          label="Biblioteca"
          :items="libraries"
          v-model="editedItem.libraryId"
          :rules="libraryRules"
        ></v-autocomplete>
      </v-col>
    </v-row>

    <v-row class="mx-12">
      <v-col cols="6" sm="12" md="6">
        <v-select
          label="Formato"
          :items="formats"
          v-model="editedItem.formatId"
          :rules="formatRules"
        ></v-select>
      </v-col>
      <v-col cols="2" sm="4" md="2">
        <v-checkbox
          label="Authority"
          v-model="isAuthority"
          @change="setIsAuthority($event)"
        ></v-checkbox>
      </v-col>
      <v-col cols="4" sm="8" md="4">
        <v-text-field
          label="Nome dell'autore"
          :disabled="!isAuthority"
          v-model="editedItem.authorName"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row class="mx-12">
      <v-col cols="6">
        <v-card outlined class="pa-3">
          <h3 class="d-flex justify-center">Tipo di record:</h3>
          <div class="d-flex justify-center">
            <v-radio-group
              v-model="editedItem.recordType"
              :rules="typeRules" row >
              <v-radio v-for="t in types" :key="t" :label="t" :value="t" ></v-radio>
            </v-radio-group>
          </div>
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card outlined class="pa-3">
          <h3 class=" d-flex justify-center">Tipologia Materiali:</h3>
          <div class="d-flex justify-center">
            <v-radio-group
              v-model="editedItem.found"
              :rules="typeMatRules" row >
              <v-radio v-for="f in founds" :key="f" :label="f" :value="f" ></v-radio>
            </v-radio-group>
          </div>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import rules from  '@/common/form-rules'

export default Vue.extend({
  name: "RecordForm",

  props: {
    editedItem: Object,
    types: Array,
    founds: Array,
    formats: Array,
    libraries: Array
  },

  data: () => ({
    isAuthority: false,
    numberRules: [ rules.notEmpty() ],
    libraryRules: [ rules.notEmpty() ],
    formatRules: [ rules.notEmpty() ],
    typeRules: [ rules.notEmpty() ],
    typeMatRules: [ rules.notEmpty() ],
  }),

  methods: {
    setIsAuthority (isAuthority: boolean) {
      this.editedItem.authorName = isAuthority ? '' : null;
      this.isAuthority = isAuthority;
    },

    setFocus () {
      (this.$refs['toFocus'] as any).focus();
    }
  }
});
</script>
