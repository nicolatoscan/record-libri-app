<template>
<div>
  <v-data-table :headers="headers" :items="items" sort-by="calories" class="elevation-1 row-pointer" :loading="loading" @click:row="rowClick">
    <slot name="custom-col"></slot>
    <template v-slot:top>
      <v-toolbar flat color="secondary">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="900px">
          <template v-if="addButton" v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Aggiungi</v-btn>
          </template>
          <v-card>
            <v-toolbar dark color="secondary">
              <v-toolbar-title class="flex text-center text-h5">{{formTitle}}</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid" :readonly="readonly">
                  <slot name="edit-form" v-bind="{ editedItem, editedId }"></slot>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <div v-if="readonly">
                <v-btn color="primary" class="ma-1" text @click="close">Chiudi</v-btn>
              </div>
              <div v-else>
                <v-btn color="primary" class="ma-1" text @click="close">Annulla</v-btn>
                <v-btn color="primary" class="ma-1" :disabled="!isFormValid" @click="save">Salva</v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-toolbar dark color="red">
              <v-toolbar-title class="flex text-center text-h5">Conferma eliminazione</v-toolbar-title>
            </v-toolbar>
            <v-card-actions>
              <v-card-text>Sei sicuro di voler eliminare questo elemento?</v-card-text>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="closeDelete">Annulla</v-btn>
              <v-btn color="red" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-for="column of headers.filter(c => c.itemTextHandler)" v-slot:[getItemSlotName(column.value)]="{ item, value, index }">
      <span>{{ column.itemTextHandler ? column.itemTextHandler(value) : value }}</span>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)" @click.stop>mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)" @click.stop>mdi-delete</v-icon>
    </template>
    <template v-slot:no-data><p class="ma-2">Nessun elemento</p></template>
  </v-data-table>
  <v-snackbar v-model="snackbarDelete" :timeout="2000" color="red">
    Elemento eliminato
    <template v-slot:action="{ attrs }"><v-btn color="red" text v-bind="attrs" @click="snackbarDelete = false" >Chiudi</v-btn></template>
  </v-snackbar>
  <v-snackbar v-model="snackbarSave" :timeout="2000">
    Elemento salvato
    <template v-slot:action="{ attrs }"><v-btn color="primary" text v-bind="attrs" @click="snackbarSave = false" >Chiudi</v-btn></template>
  </v-snackbar>
</div>
</template>


<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CrudTable",

  props: {
    title: String,
    headers: Array,
    items: Array,
    loading: {
      type: Boolean,
      default: false
    },
    defaultItem: {
      type: Object,
      default: () => ({}),
    },
    addButton: {
      type: Boolean,
      default: true
    },
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    editedId: null as number | null,
    editedItem: {},
    isFormValid: false,
    snackbarDelete: false,
    snackbarSave: false,
    readonly: false,
  }),

  computed: {
    formTitle () {
      if (this.readonly) {
        return "Visualizza";
      }
      return this.editedId === null ? 'Nuovo elemento' : 'Modifica elemento';
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  async created () {
    await this.initialize();
  },

  methods: {

    rowClick(row: any): void {
      this.editedItem = { ...row };
      this.readonly = true;
      this.dialog = true;
    },

    getItemSlotName(name: string): string {
      return `item.${name}`;
    },

    async initialize () {
      //TODO: 
      // this.libraries = await apiService.libraries.getAll();
    },

    editItem (l: Record<string, unknown>) {
      this.editedId = l.id as number;
      this.editedItem = { ...l };
      this.dialog = true;
    },

    deleteItem (l: Record<string, unknown>) {
      this.editedId = l.id as number;
      this.editedItem = { ...l };
      this.dialogDelete = true;
    },

    async deleteItemConfirm () {
      if (this.editedId !== null) {
        this.$emit('remove', { id: this.editedId, done: () => {
          this.snackbarDelete = true;
          this.closeDelete();
        }});
      } else {
        this.closeDelete();
      }
    },

    close () {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedId = null;
        this.readonly = false;
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedId = null;
      })
    },

    async save() {
      if (!this.isFormValid) return;

      this.$emit(
        this.editedId === null ? 'add' : 'update',
        { id: this.editedId, item: { ...this.editedItem }, done: () => {
          this.snackbarSave = true;
          this.close();
        }}
      );
    },
  },
});
</script>

<style> 
.row-pointer > .v-data-table__wrapper > table > tbody > tr:hover {  
  cursor: pointer;
}
</style>