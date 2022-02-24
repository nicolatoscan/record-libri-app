<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500" >
      <v-card>
        <v-card-title class="text-h5 error">Errore</v-card-title>
        <v-card-text class="mt-4">{{message}}</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="close">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Alert",
  props: {
    message: String,
    dialog: Boolean,
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
});
</script>
