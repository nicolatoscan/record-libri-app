<template>
  <v-menu
    ref="menu1" v-model="menu1"
    :close-on-content-click="false"
    transition="scale-transition" offset-y
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="selected"
        v-on:input="$emit('input', $event)"
        @blur="date = parseDate(value)"
        v-on="on" value
        :label="label" color="primary lighten-1" prepend-icon="mdi-calendar"
      />
    </template>
    <v-date-picker
      v-model="selected"
      @input="menu1 = false"
      no-title
      header-color="primary lighten-1"
      color="primary lighten-1"
    />
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CustomDatePicker",

  props: {
    label: { type: String, default: 'Data' },
    value: { type: String, default: '' }
  },

  data: () => ({
    menu1: null as string | null,
    date: null as string | null,
  }),

  computed: {
    selected: {
      get() { return this.value; },
      set(value) { this.$emit('input', value); }
    },
    computedDateFormatted() {
      return this.date ?? null;
    }
  },

  // watch: {
  //   date(val) {
  //       this.value = this.formatDate(this.date)
  //   }
  // },

  methods: {
    formatDate(date: string) {
      if (!date) { return null }
      return date
    },
    parseDate(date: string) {
      if (!date) { return null }

      const [year, month, day] = date.split('-')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }

});
</script>