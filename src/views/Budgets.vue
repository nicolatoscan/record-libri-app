<template>
  <crud-table
      title="Budget"
      :headers="headers"
      :items="budgets"
      :defaultItem="defaultItem"
      :loading="loading"
      :hideDelete="true"
      :addButton="false"
      @update="update($event.id, $event.item, $event.done)"
  >
    <template v-slot:edit-form="slotProps">
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-text-field
            label="Budget"
            v-model="slotProps.editedItem.budget"
            type="number"
            :rules="budgetRules"
          ></v-text-field>
        </v-col>
      </v-row>
    </template>
  </crud-table>
</template>

<script lang="ts">
import Vue from "vue";
import apiService from '@/services/api.service';
import CrudTable from '@/components/CrudTable.vue';
import rules from '@/common/form-rules';

type Budget = {
  id: number,
  libraryName: string,
  budget: string | number,
  budgetLeft: number | null,
  budgetUsed: number,
}

export default Vue.extend({
  name: "Budget",
  components: { CrudTable },

  data: () => ({
    loading: true,
    headers: [
      { text: 'Libreria', value: 'libraryName', width: '40%' },
      { text: 'Record registrati', value: 'budgetUsed', width: '20%' },
      { text: 'Budget', value: 'budget', width: '20%' },
      { text: 'Budget Rimasto', value: 'budgetLeft', width: '20%' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    budgets: [] as Budget[],
    defaultItem: {
      id: -1,
      budget: 0,
      budgetLeft: null,
      libraryName: '',
    } as Budget,
    budgetRules: [ rules.notEmpty() ],
  }),

  async created () {
    const budgetsUsed = await apiService.libraries.getBudgetUsed();
    const libraries = await apiService.libraries.getAll();

    this.budgets = libraries.map(l => {
      const bu = budgetsUsed.find(b => b.libraryId === l.id) ?? null;
      return {
        id: l.id ?? 0,
        libraryName: l.name,
        budget: l.budget === null ? 'Non impostato' : l.budget,
        budgetLeft: l.budget && bu ? l.budget - bu.budgetUsed : null,
        budgetUsed: bu ? bu.budgetUsed : 0,
      };
    });
    this.loading = false;
  },

  methods: {

    async update(id: number, t: Budget, done: () => void) {
        await apiService.libraries.updateBudget(id, +t.budget);
        t.budgetLeft = +t.budget - t.budgetUsed;
        done();
    },

  },
});
</script>