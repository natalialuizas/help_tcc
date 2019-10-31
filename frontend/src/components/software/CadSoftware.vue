<template>
  <div class="software">
    <b-form>
      <input id="software-id" type="hidden" v-model="software.id" />
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Nome:" label-for="software-nameSoftware">
            <b-form-input
              id="software-name"
              type="text"
              v-model="software.nameSoftware"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o Nome do Software..."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col xs="12">
          <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>

          <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>

          <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-col>
      </b-row>
    </b-form>
       <hr>
      <b-table hover striped :items="softwares" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadSoftware(data.item)" class="mr-2">
                    <i class="fa fa-edit"></i>
                </b-button>
                <b-button variant="danger" @click="loadSoftware(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
     <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
  </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
  name: "Software",
  data: function() {
    return {
      mode: "save",
      software: {},
      softwares: [],
      page: 1,
      limit: 0,
      count: 0,
      fields: [
        // alterando os nomes da tabelas que vem do banco,
        // sortable é utilizado para ordenação das colunas
        { key: "id", label: "Código", sortable: true },
        { key: "nameSoftware", label: "Nome", sortable: true },
        { key: "actions", label: "Ações" }
      ]
    };
  },
  methods: {
     // carregar os Softwares do backend
     loadSoftwares() {
      const url = `${baseApiUrl}/softwares?page=${this.page}`;
      axios.get(url).then(res => {
        this.softwares = res.data.data;
        this.count = res.data.count;
        this.limit = res.data.limit;
      });
    },
    reset() {
      // voltando pro modo salvar
      this.mode = "save";
      // zerando o form
      this.software = {};
      // carregando a tabela
      this.loadSoftwares();
    },
    save() {
      // verificando o id do softwares, caso tiver setado irá ser put
      const method = this.software.id ? "put" : "post";
      const id = this.software.id ? `/${this.software.id}` : "";
      axios[method](`${baseApiUrl}/softwares${id}`, this.software)
        .then(() => {
          // mostrando a mensagem de sucesso
          this.$toasted.global.defaultSuccess();
          // resetando o formulario e trazendo nova lista de softwares
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.software.id;
      axios
        .delete(`${baseApiUrl}/softwares/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadSoftware(software, mode = "save") {
      this.mode = mode;
      this.software = { ...software };
    }
  },
  mounted() {
    this.loadSoftwares()
  },
   watch: {
    page() {
      this.loadSoftwares()
    }
  }
};
</script>

<style>

</style>
