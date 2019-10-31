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
            <b-form-select id="problem-type_id" :options="types" v-model="problem.type_id" />
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
    <hr />
    <b-table hover striped :items="problems" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadProblem(data.item)" class="mr-2">
        <i class="fa fa-edit"></i>
        </b-button>
        <b-button variant="danger" @click="loadProblem(data.item, 'remove')">
         <i class="fa fa-trash"></i> 
        </b-button>
      </template>
    </b-table>
      <!-- paginação -->
      <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
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
      types: ['NFE', 'SAT', 'SISTEMA'],
      page: 1,
      limit: 0,
      count: 0,
      fields: [
        { key: "id", label: "Código", sortable: true },
        { key: "description", label: "Nome", sortable: true },
        { key: "softwareId", label: "Software", sortable: true },
        { key: "type", label: "Tipo", sortable: true },
        { key: "actions", label: "Ações" }
      ]
    }
  },
  methods: {
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
          return { value: software.id, text: software.nameSoftware }
        })
      })
    },
    loadTypes() {
      const url = `${baseApiUrl}/types`
      axios.get(url).then(res => {
        this.types = res.data.map(type => {
          return { value: type.id, text: `${type.name} ` }
        });
      });
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
    this.loadTypes()
  }
};
</script>

<style>
</style>
