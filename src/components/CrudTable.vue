<template>
<div>
  <v-data-table :headers="headers" :items="items" sort-by="id" :sort-desc="true" class="elevation-1 row-pointer" :loading="loading" @click:row="rowClick">
    <slot name="custom-col"></slot>
    <template v-slot:top>
      <v-toolbar flat color="primary">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="900px" >
          <template v-if="addButton" v-slot:activator="{ on, attrs }">
            <slot name="activator">
              <v-btn color="primary darken-2" dark class="mb-2" v-bind="attrs" v-on="on">Aggiungi</v-btn>
            </slot>
          </template>
          <v-card>

            <v-form v-model="isFormValid" :readonly="readonly" @keyup.native.enter="save" onSubmit="return false;">

              <v-progress-linear :active="savingLoading" indeterminate absolute bottom></v-progress-linear>
              <v-toolbar dark color="primary">
                <v-toolbar-title class="flex text-center text-h5">{{formTitle}}</v-toolbar-title>
              </v-toolbar>


              <v-card-text>
                <v-container>
                  <slot name="edit-form" v-bind="{ editedItem, editedId }"></slot>
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

            </v-form>

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
      <v-container v-if="filters"><v-form v-model="isFormValid" :readonly="readonly">
        <slot name="filter-form" v-bind="{ editedItem, editedId }"></slot>
      </v-form></v-container>
    </template>
    <template v-for="column of headers.filter(c => c.itemTextHandler)" v-slot:[getItemSlotName(column.value)]="{ item, value, index }">
      <span>{{ column.itemTextHandler ? column.itemTextHandler(value) : value }}</span>
    </template>
    <template v-slot:item.actions="{ item }">
      <div v-if="!readonlyTable">
        <v-icon small class="mr-2" @click="editItem(item)" @click.stop>mdi-pencil</v-icon>
        <v-icon v-if="!hideDelete" small @click="deleteItem(item)" @click.stop>mdi-delete</v-icon>
      </div>
    </template>
    <template v-slot:no-data><p class="ma-2">Nessun elemento</p></template>
  </v-data-table>
  <!-- SNACKBARS -->
  <v-snackbar v-model="snackbarDelete" :timeout="2000" color="danger">
    Elemento eliminato
    <template v-slot:action="{ attrs }"><v-btn color="danger" text v-bind="attrs" @click="snackbarDelete = false" >Chiudi</v-btn></template>
  </v-snackbar>
  <v-snackbar v-model="snackbarSave" :timeout="2000">
    Elemento salvato
    <template v-slot:action="{ attrs }"><v-btn text v-bind="attrs" @click="snackbarSave = false" >Chiudi</v-btn></template>
  </v-snackbar>

  <!-- ALERT -->
  <alert :dialog="errorDialog" :message="errorDialogText" @close="errorDialog = false" ></alert>
</div>
</template>


<script lang="ts">
import Vue from "vue";
import Alert from '@/components/Alert.vue'

export default Vue.extend({
  name: "CrudTable",
  components: { Alert },

  props: {
    title: String,
    headers: Array,
    items: Array,
    loading: { type: Boolean, default: false },
    defaultItem: { type: Object, default: () => ({}) },
    addButton: { type: Boolean, default: true },
    filters: { type: Boolean, default: false },
    readonlyTable: { type: Boolean, default: false },
    hideDelete: { type: Boolean, default: false },
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
    savingLoading: false,
    errorDialog: false,
    errorDialogText: '',
  }),

  computed: {
    formTitle () {
      if (this.readonly) return "Visualizza";
      return this.editedId === null ? 'Nuovo elemento' : 'Modifica elemento';
    },
  },

  watch: {
    dialog (val) { val || this.close() },
    dialogDelete (val) { val || this.closeDelete() },
  },

  methods: {


    getItemSlotName(name: string): string {
      return `item.${name}`;
    },

    findIndex(id: number): number {
      return this.items.findIndex((i: any) => i.id === id);
    },

    rowClick(row: any): void {
      this.editedItem = { ...row };
      this.readonly = true;
      this.dialog = true;
    },

    editItem(l: Record<string, unknown>) {
      if (this.readonlyTable) return;

      this.editedId = l.id as number;
      this.editedItem = { ...l };
      this.dialog = true;
    },

    deleteItem(l: Record<string, unknown>) {
      if (this.readonlyTable) return;

      this.editedId = l.id as number;
      this.editedItem = { ...l };
      this.dialogDelete = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedId = null;
        this.readonly = false;
        this.savingLoading = false;
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedId = null;
        this.savingLoading = false;
      })
    },

    removed(id: number | null) {
      if (id) {
        this.items.splice(this.findIndex(id), 1);
      }
      this.snackbarDelete = true;
      this.savingLoading = false;
      this.closeDelete();
    },
    failed(msg: string) {
      this.errorDialogText = msg;
      this.savingLoading = false;
      this.errorDialog = true;
    },

    saved(id: number | null, item: Record<string, unknown>) {
      if (id !== null) {
        Object.assign(this.items[this.findIndex(id)], item);
      } else {
        this.items.push(item);
      }
      this.snackbarSave = true;
      this.savingLoading = true;
      this.close();
    },

    async deleteItemConfirm() {
      this.savingLoading = false
      if (this.editedId !== null) {
        this.$emit('remove', {
          id: this.editedId,
          done: () => { this.removed(this.editedId); },
          fail: (msg: string) => { this.failed(msg); }
        });
      } else {
        this.closeDelete();
      }
    },

    async save() {
      if (!this.isFormValid) return;

      this.savingLoading = true;
      this.$emit(
        this.editedId === null ? 'add' : 'update',
        {
          id: this.editedId,
          item: this.editedItem,
          done: () => { this.saved(this.editedId, this.editedItem) },
          fail: (msg: string) => { this.failed(msg) }
        }
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