<template>
  <div class="problem">
    <b-form>
      <input id="problem-id" type="hidden" v-model="problem.id" />
      <b-row>
        <b-col md="8" sm="12">
          <b-form-group label="Descrição:" label-for="problem-description">
            <b-form-input
              id="problem-description"
              type="text"
              v-model="problem.description"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o Nome do Erro..."
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group  label="Software:" label-for="problem-softwareId">
            <b-form-select
              id="problem-softwareId"
              :options="softwares"
              v-model="problem.softwareId"
              :readonly="mode === 'remove'"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8" sm="12">
          <b-form-group  v-if="mode === 'save' "label="Arquivo:" label-for="problem-file_id">
            <b-form-file id="problem-file_id" accept=".jpg, .png, .gif"></b-form-file>
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group v-if="mode === 'save'" label="Tipo:" label-for="problem-type_id">
            <b-form-select id="problem-type" :options="types" v-model="problem.type" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group v-if="mode === 'save'" label="Solução" label-for="problem-content">
        <VueEditor v-model="problem.solution" placeholder="Informe as possiveis soluções..." />
      </b-form-group>
      <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
      <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
      <b-button class="ml-2" @click="reset">Cancelar</b-button>
    </b-form>

         <!-- filtro de pesquisa -->
     <div class="filtro">
    <b-row align-h="end">
       <b-col md="5" sm="12" >
          <b-input-group>
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Digite sua pesquisa"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Limpar</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    </div>

    <b-table hover striped :items="problems" show-empty :fields="fields" :filter="filter"
      striped responsive="sm" :filterIncludedFields="filterOn"  @filtered="onFiltered"> <template v-slot:empty="scope">
        <!-- Texto que aparece quando não possui registro ou quando não encontrou registro -->
      <h4>{{ scope.emptyText }}</h4>
      </template>
      <template v-slot:emptyfiltered="scope">
        <h4>{{ scope.emptyFilteredText }}</h4>
      </template>
      
       <!-- chave estrageira convertendo texto -->
        <template slot="name" slot-scope="data">{{ data.value.softwareId }}</template>

         <!--  botões de visualizar, alterar e excluir que aparece com registros -->
      <template slot="actions" slot-scope="data">
        <!-- botão de visualizar -->
        <b-button variant="info" size="sm" @click="loadProblem(data.item)" class="mr-2">
            <i class="fa fa-eye"></i>
        </b-button>
         <!-- botão de alterar -->
        <b-button variant="warning" size="sm" @click="loadProblem(data.item)" class="mr-2">
        <i class="fa fa-edit"></i>
        </b-button>
          <!-- botão de excluir -->
        <b-button variant="danger" size="sm" @click="loadProblem(data.item, 'remove')">
         <i class="fa fa-trash"></i> 
        </b-button>
      </template>
    </b-table>
    <hr/>
      <!-- paginação -->
      <b-pagination align="center" size="md" v-model="page" :total-rows="count" :per-page="limit" />
  </div>
</template>

<script>
// importando url do backend e as mensagems para erros
import { baseApiUrl, showError } from '@/global'
// cliente HTTP (faz comunicação do backend e frontend)
import axios from 'axios'
// caixa de edição
import { VueEditor } from "vue2-editor"

export default {
  name: "Problem",
  components: { VueEditor },
  data: function() {
    return {
      mode: "save",
      problem: {},
      problems: [],
      softwares: [],
      filter: null,
      filterOn: [],
      types: ['NFE', 'SAT', 'SISTEMA'],
      page: 1,
      limit: 0,
      count: 0,
      fields: [
        { key: "id", label: "Código", sortable: true },
        { key: "description", label: "Nome", sortable: true },
        { key: "softwareId", label: "Software", formatter: "softwaresNames", sortable: true },
        { key: "type", label: "Tipo", sortable: true },
        { key: "actions", label: "Ações" }
      ]
    }
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
    softwaresNames(id) {
      const software = this.softwares.find(software => software.id === id);
      return software ? `${software.nameSoftware}` : software.id;
    },
      onFiltered(filteredItems) {
       // Dispara a paginação para atualizar o número de botões / páginas devido à filtragem
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
     // carregar base de conhecimento do backend
    loadProblems() {
      const url = `${baseApiUrl}/problems?page=${this.page}`
      axios.get(url).then(res => {
        this.problems = res.data.data
        this.count = res.data.count
        this.limit = res.data.limit
      });
    },
    reset() {
       // voltando pro modo salvar
      this.mode = "save"
      // zerando o form
      this.problem = {}
      // carregando a tabela
      this.loadProblems()
    },
    save() {
      // 
      const method = this.problem.id ? "put" : "post"
      // faz verificação se o id do problema está setado
      const id = this.problem.id ? `/${this.problem.id}` : ""
      axios[method](`${baseApiUrl}/problems${id}`, this.problem)
        .then(() => {
          // mostrando a mensagem de sucesso
          this.$toasted.global.defaultSuccess()
          // resetando o formulario e trazendo nova lista de problemas
          this.reset()
        })
        .catch(showError)
    },
    remove() {
      const id = this.problem.id;
      axios
        .delete(`${baseApiUrl}/problems/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess()
          this.reset();
        })
        .catch(showError);
    },
    loadProblem(problem, mode = "save") {
      this.mode = mode;
      axios
        .get(`${baseApiUrl}/problems/${problem.id}`)
        .then(res => (this.problem = res.data))
    },
    loadSoftwares() {
      const url = `${baseApiUrl}/softwaresList`
      axios.get(url).then(res => {
        this.softwares = res.data.map(software => {
          return {...software, value: software.id, text: software.nameSoftware }
        })
      })
    }
  },
  watch: {
    page() {
      this.loadProblems()
    }
  },
  mounted() {
    this.loadSoftwares()
    this.loadProblems()
  }
};
</script>

<style>
    .filtro {
        padding-top:  60px;
    }
</style>
