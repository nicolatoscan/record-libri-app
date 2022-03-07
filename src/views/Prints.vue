<template>
  <div>
    <h1>Stampe</h1>
    <v-btn color="primary" @click="print()">Stampa</v-btn>
  </div>
</template>
<script lang="ts">

import Vue from "vue";
import printsService from '@/services/prints.service';
import apiService from '@/services/api.service'

export default Vue.extend({
  name: "Records",


  methods: {
    async print () {
      const records = await apiService.records.getAll();
      printsService.example(records);
    }
  }

});
</script>