  <template>
  <v-data-table :headers="headers" :items="items" sort-by="calories" class="elevation-1" >
    <template v-slot:top>
      <v-toolbar flat color="secondary">
        <v-toolbar-title>Biblioteche</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Aggiungi</v-btn>
          </template>
          <v-card>
            <v-toolbar dark color="secondary">
              <v-toolbar-title class="flex text-center text-h5">{{formTitle}}</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-container>
                <slot name="edit-form"></slot>
                <!-- <v-row>
                  <v-col cols="12" sm="3" md="3">
                    <v-text-field
                      v-model="editedItem.code"
                      label="Codice"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="9" md="9">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Nome"
                    ></v-text-field>
                  </v-col>
                </v-row> -->
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="close">Annulla</v-btn>
              <v-btn color="primary" @click="save">Salva</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-toolbar dark color="secondary">
              <v-toolbar-title class="flex text-center text-h5">Sei sicuro di voler eliminare questo elemento?</v-toolbar-title
              >
            </v-toolbar>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="closeDelete">Annulla</v-btn>
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
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>


<script lang="ts">
import Vue from "vue";


export default Vue.extend({
  name: "CrudTable",

  props: {
    title: String,
    headers: Array,
    items: Array,
    defaultItem: Object,
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    editedId: null as number | null,
    editedItem: {}
  }),

  computed: {
    formTitle () {
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
        this.$emit('delete', { id: this.editedId, done: () => { this.closeDelete(); }});
      } else {
        this.closeDelete();
      }
    },

    close () {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedId = null;
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedId = null;
      })
    },

    async save () {
      this.$emit(
        this.editedId === null ? 'add' : 'edit',
        { id: this.editedId, element: { ...this.editedItem }, done: () => { this.close(); }}
      );
    },
  },
});
</script>