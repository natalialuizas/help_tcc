<template>
  <div class="software">
    <b-form>
      <input id="software-id" type="hidden" v-model="software.id" />
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Nome:" label-for="software-nameSoftware">
            <b-form-input id="software-name" type="text" v-model="software.nameSoftware" required
              :readonly="mode === 'remove'" placeholder="Informe o Nome do Software..." />
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

    <!-- filtro de pesquisa -->
    <div class="filtro">
      <b-row align-h="end">
        <b-col md="5" sm="12">
          <b-input-group>
            <b-form-input v-model="filter" type="search" id="filterInput" placeholder="Digite sua pesquisa">
            </b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Limpar</b-button>
            </b-input-group-append>
          </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
    </div>


    <b-table hover striped :items="softwares" show-empty :fields="fields" :filter="filter"
      striped responsive="sm" :filterIncludedFields="filterOn" @filtered="onFiltered">
      <!-- Texto que aparece quando não possui registro ou quando não encontrou registro -->
      <template v-slot:empty="scope">
        <h4>{{ scope.emptyText }}</h4>
      </template>
      <template v-slot:emptyfiltered="scope">
        <h4>{{ scope.emptyFilteredText }}</h4>
      </template>

       <template slot="actions" slot-scope="data">
        <b-button size="sm" variant="info" @click="data.toggleDetails" class="mr-1">
           <i class="fa fa-eye"></i>
        </b-button>

         <b-button variant="warning" size="sm" @click="loadSoftware(data.item)" class="mr-1">
          <i class="fa fa-edit"></i>
        </b-button>
        
        <b-button variant="danger" size="sm" @click="loadSoftware(data.item, 'remove')" class="mr-1">
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
      <template v-slot:row-details="row">
        <b-card>
            <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"><b>ID:</b></b-col>
                <b-col>{{ row.item.id }}</b-col>
              </b-row>
    
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"><b>Software:</b></b-col>
                <b-col>{{ row.item.nameSoftware }}</b-col>
              </b-row>
        </b-card>
      </template>
       </b-table>   
    <hr/>
    <b-pagination align="center" size="md" v-model="page" :total-rows="count" :per-page="limit" />
  </div>
</template>

<script>
  import { baseApiUrl, showError } from '@/global'
  import axios from 'axios'

  export default {
    name: "Software",
    data: function () {
      return {
        mode: "save",
        software: {},
        softwares: [],
        filter: null,
        filterOn: [],
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
    computed: {
      sortOptions() {
        // Crie uma lista de opções a partir dos campos
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
      }
    },
    methods: {
      onFiltered(filteredItems) {
        // Dispara a paginação para atualizar o número de botões / páginas devido à filtragem
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
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
  .filtro {
    padding-top: 20px;
  }
</style>