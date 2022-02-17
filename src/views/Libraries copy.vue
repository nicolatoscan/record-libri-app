<template>

  <v-data-table :headers="headers" :items="libraries" sort-by="calories" class="elevation-1" >
    <template v-slot:top>
      <v-toolbar flat color="secondary">
        <v-toolbar-title>Biblioteche</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px" >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">New Item</v-btn>
          </template>
          <v-card>
            <v-toolbar dark color="secondary">
              <v-toolbar-title class="flex text-center text-h5">{{formTitle}}</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="3" md="3">
                    <v-text-field v-model="editedItem.code" label="Codice" ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="9" md="9" >
                    <v-text-field v-model="editedItem.name" label="Nome" ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="close" >Cancel</v-btn>
              <v-btn color="primary" @click="save" >Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-toolbar dark color="secondary">
              <v-toolbar-title class="flex text-center text-h5">Are you sure you want to delete this item?</v-toolbar-title>
            </v-toolbar>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="primary" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize" >Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { LibraryDTO } from '@/types/dto';
import Vue from "vue";
import apiService from '../services/api.service';


export default Vue.extend({
  name: "Libraries",

  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Codice', value: 'code', width: '25%' },
      { text: 'Nome', value: 'name', width: '75%' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    libraries: [] as LibraryDTO[],
    editedCode: null as string | null,
    editedItem: {
      code: '',
      name: '',
    } as LibraryDTO,
    defaultItem: {
      code: '',
      name: '',
    } as LibraryDTO,
  }),

  computed: {
    formTitle () {
      return this.editedCode === null ? 'New Item' : 'Edit Item'
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

    async initialize () {
      this.libraries = await apiService.libraries.getAll();
    },

    editItem (l: LibraryDTO) {
      this.editedCode = l.code;
      this.editedItem = { ...l };
      this.dialog = true;
    },

    deleteItem (l: LibraryDTO) {
      this.editedCode = l.code;
      this.editedItem = { ...l };
      this.dialogDelete = true;
    },

    async deleteItemConfirm () {
      if (this.editedCode !== null) {
        await apiService.libraries.delete(this.editedCode);
        this.libraries = this.libraries.filter(l => l.code !== this.editedCode);
      }
      this.closeDelete();
    },

    close () {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedCode = null;
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedCode = null;
      })
    },

    async save () {
      if (this.editedCode !== null) {
        await apiService.libraries.patch(this.editedCode, this.editedItem);
        const i = this.libraries.findIndex(x => x.code === this.editedCode)
        Object.assign(this.libraries[i], this.editedItem);
      } else {
        await apiService.libraries.add(this.editedItem);
        this.libraries.push(this.editedItem);
      }
      this.close()
    },
  },
});
</script>