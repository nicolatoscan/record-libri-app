<template>
  <crud-table
      title="Tags"
      :headers="headers"
      :items="tags"
      :defaultItem="defaultItem"
      :loading="loading"
      @add="add($event.item, $event.done)"
      @update="update($event.id, $event.item, $event.done)"
      @remove="remove($event.id, $event.done)"
  >
    <template v-slot:edit-form="slotProps">
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-text-field
            autofocus
            label="Nome"
            v-model="slotProps.editedItem.name"
            :rules="nameRules" :counter="50"
          ></v-text-field>
        </v-col>
      </v-row>
    </template>
  </crud-table>
</template>

<script lang="ts">
import { TagDTO } from '@/types/dto';
import Vue from "vue";
import apiService from '@/services/api.service';
import CrudTable from '@/components/CrudTable.vue';
import rules from '@/common/form-rules';

export default Vue.extend({
  name: "Tags",
  components: { CrudTable },

  data: () => ({
    loading: true,
    headers: [
      { text: 'Id', value: 'id', width: '25%' },
      { text: 'Nome', value: 'name', width: '75%' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    tags: [] as TagDTO[],
    defaultItem: {
      name: '',
    } as TagDTO,
    nameRules: [ rules.length(50) ],
  }),

  async created () {
    this.tags = await apiService.tags.getAll();
    this.loading = false;
  },

  methods: {

    async add(t: TagDTO, done: () => void) {
        t.id = await apiService.tags.add(t);
        done();
    },

    async update(id: number, t: TagDTO, done: () => void) {
        await apiService.tags.update(id, t);
        done();
    },

    async remove(id: number, done: () => void) {
        await apiService.tags.delete(id);
        done();
    },

  },
});
</script>