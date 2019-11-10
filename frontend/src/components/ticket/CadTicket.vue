<template>
  <div class="ticket">
    <b-form>
      <input id="ticket-id" type="hidden" v-model="ticket.id" />

      <!---- Input do Cliente ---->
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Cliente:" label-for="ticket-cliente">

            <v-select v-model="ticket.clientId" :options="clients" label="nomeFantasia"
              :reduce="nomeFantasia => nomeFantasia.id" :readonly="mode === 'remove'" />
            <template v-slot:option="client">
              {{ client.nomeFantasia }}
            </template>
            <template v-slot:selected-option="client">
              {{ client.nomeFantasia }}
            </template>
            </v-select>
          </b-form-group>
        </b-col>

        <!----- Input da Data ---->
        <b-col md="3" sm="12">
          <b-form-group :readonly="mode === 'remove'" label="Data:" placeholder="__/__/____" label-for="ticket-date">

            <b-form-input id="type-date" :readonly="mode === 'remove'" type="text" v-model="ticket.date" v-mask="date"
              placeholder="__/__/____">
            </b-form-input>
          </b-form-group>
        </b-col>

        <!----- Input do Status ---->
        <b-col md="3" sm="12">
          <b-form-group label="Status:" label-for="ticket-status">

            <b-form-select id="ticket-status" :options="status" v-model="ticket.status" :readonly="mode === 'remove'" />
          </b-form-group>
        </b-col>
      </b-row>

      <!----- Input do Problema ---->
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group v-if="mode === 'save'" label="Problema:" label-for="ticket-problemId">

            <b-form-select id="ticket-problemId" :options="problems" v-model="ticket.problemId">
            </b-form-select>
          </b-form-group>
        </b-col>

        <!----- Input do Software ---->
        <b-col md="2" sm="12">
          <b-form-group v-if="mode === 'save'" label="Software:" label-for="ticket-softwareId">

            <b-form-select id="ticket-softwareId" :options="softwares" v-model="ticket.softwareId">
            </b-form-select>
          </b-form-group>
        </b-col>

        <!----- Input do Solicitante ---->
        <b-col md="3" sm="12">
          <b-form-group v-if="mode === 'save'" label="Solicitante:" label-for="ticket-solicitante">

            <b-form-input id="ticket-solicitante" v-model="ticket.solicitante" />
          </b-form-group>
        </b-col>

        <!----- Input do Atendente ---->
        <b-col md="3" sm="12">
          <b-form-group v-if="mode === 'save'" label="Atendente:" label-for="ticket-userId">

            <b-form-select id="ticket-user_id" :options="users" v-model="ticket.userId" />
          </b-form-group>
        </b-col>
      </b-row>

      <!----- Input da Solucao---->
      <b-form-group v-if="mode === 'save'" label="Solução" label-for="ticket-content">

        <VueEditor v-model="ticket.description" placeholder="Informe a Solução..." />
      </b-form-group>

      <!----- Botões de salvar, remover e cancelar ---->
      <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
      <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
      <b-button class="ml-2" @click="reset">Cancelar</b-button>
    </b-form>

    <!----- linha separando formulario e as tabelas ---->

    <!-- filtro de pesquisa -->
    <div class="filtro">
      <b-row align-h="end">
        <b-col md="5" sm="12">
          <b-input-group>
            <b-form-input v-model="filter" type="search" id="filterInput" 
            placeholder="Digite sua pesquisa">
            </b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Limpar</b-button>
            </b-input-group-append>
          </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
    </div>

    <!----- tabelas ---->
    <b-table 
    responsive
    hover 
    striped 
    :items="tickets" 
    show-empty :fields="fields" 
    :filter="filter"
    :filterIncludedFields="filterOn" 
    @filtered="onFiltered">

      <!-- chave estrageira -->
      <template slot="name" slot-scope="data">{{ data.value.userId }}</template>
      <template slot="name" slot-scope="data">{{ data.value.problemId }}</template>
      <template slot="name" slot-scope="data">{{ data.value.clientId }}</template>
      <template slot="name" slot-scope="data">{{ data.value.softwareId }}</template>


      <!-- Texto que aparece quando não possui registro ou quando não encontrou registro -->
      <template v-slot:empty="scope">
        <h4>{{ scope.emptyText }}</h4>
      </template>
      <template v-slot:emptyfiltered="scope">
        <h4>{{ scope.emptyFilteredText }}</h4>
      </template>
      <!-- status  -->
      <template slot="status" slot-scope="row">
        <b-button variant="outline-success" size="sm" v-if="row.item.status === 'RESOLVIDO'">
          {{ row.item.status }}
        </b-button>
        <b-button variant="outline-danger" size="sm" v-if="row.item.status === 'PENDENTE'">
          {{ row.item.status }}
        </b-button>
      </template>

      <!--  botões de visualizar, alterar e excluir que aparece com registros -->
      <template slot="actions" slot-scope="data">
        <!-- botão de visualizar -->
        <b-button size="sm" variant="info" @click="data.toggleDetails" class="mr-1">
           <i class="fa fa-eye"></i>
        </b-button>
        <!-- botão de alterar -->
        <b-button variant="warning" size="sm" @click="loadTicket(data.item)"  class="mr-1">
          <i class="fa fa-edit"></i>
        </b-button>
        <!-- botão de excluir -->
        <b-button variant="danger" size="sm" @click="loadTicket(data.item, 'remove')"  class="mr-1">
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
                <b-col sm="3" class="text-sm-right"><b>Cliente:</b></b-col>
                <b-col>{{ row.item.clientId}}</b-col>
              </b-row>
              <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Data:</b></b-col>
                  <b-col>{{ row.item.date }}</b-col>
              </b-row>
              <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Problema:</b></b-col>
                  <b-col>{{ row.item.problemId }}</b-col>
              </b-row>
              <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Software:</b></b-col>
                  <b-col>{{ row.item.softwareId }}</b-col>
              </b-row>
              <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Solicitante:</b></b-col>
                  <b-col>{{ row.item.solicitante  }}</b-col>
              </b-row>
              <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Atendente:</b></b-col>
                  <b-col>{{ row.item.userId  }}</b-col>
              </b-row>
        </b-card>
      </template>
    </b-table>
    <hr />
    <!-- paginação -->
      <b-pagination align="center" size="md" v-model="page" :total-rows="count" :per-page="limit" />
  </div>
</template>

<script>
  import { baseApiUrl, showError } from '@/global'
  import axios from 'axios'
  import vSelect from "vue-select";
  import "vue-select/dist/vue-select.css";

  // caixa de edição da solução
  import { VueEditor } from "vue2-editor";


  export default {
    name: "ticket",
    components: { VueEditor, vSelect },
    data: function () {
      return {
        mode: "save",
        clientId: '',
        client: '',
        ticket: {},
        tickets: [],
        softwares: [],
        clients: [],
        users: [],
        problems: [],
        filter: null,
        filterOn: [],
        // paginação
         page: 1,
        limit: 0,
        count: 0,
        // cabeçalho da tabela
        fields: [
          { key: "id", label: "Cod" },
          { key: "clientId", label: "Cliente", formatter: "clientNames", sortable: true },
          { key: "problemId", label: "Problema", formatter: "problemsNames", sortable: true },
          { key: "softwareId", label: "Software", formatter: "softwareNames", sortable: true },
          { key: "userId", label: "Atendente", formatter: "assignNames", sortable: true },
          { key: "date", label: "Data", sortable: true },
          { key: "status", label: "Status", sortable: true },
          { key: "actions", label: "Ações" }
        ],
        status: ['RESOLVIDO', 'PENDENTE'],
        date: "##/##/####"
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
      },
    },
    methods: {
      softwareNames(id) {
        const software = this.softwares.find(software => software.id === id);
        return software ? `${software.nameSoftware}` : software.id;
      },
      problemsNames(id) {
        const problem = this.problems.find(problem => problem.id === id);
        return problem ? `${problem.description}` : problem.id;
      },
      clientNames(id) {
        const client = this.clients.find(client => client.id === id);
        return client ? `${client.nomeFantasia}` : client.id
      },
      assignNames(id) {
        const user = this.users.find(user => user.id === id);
        return user ? `${user.name}` : user.id;
      },
      onFiltered(filteredItems) {
        // Dispara a paginação para atualizar o número de botões / páginas devido à filtragem
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      loadTickets() {
        const url = `${baseApiUrl}/tickets?page=${this.page}`;
        axios.get(url).then(res => {
          this.tickets = res.data.data;
          this.count = res.data.count;
          this.limit = res.data.limit;

        });
      },
      reset() {
        this.mode = "save";
        this.ticket = {};
        this.loadTickets();
      },
      save() {
        const method = this.ticket.id ? "put" : "post";
        const id = this.ticket.id ? `/${this.ticket.id}` : "";
        axios[method](`${baseApiUrl}/tickets${id}`, this.ticket)
          .then(() => {
            this.$toasted.global.defaultSuccess();
            this.reset();
          })
          .catch(showError);
      },
      remove() {
        const id = this.ticket.id;
        axios
          .delete(`${baseApiUrl}/tickets/${id}`)
          .then(() => {
            this.$toasted.global.defaultSuccess();
            this.reset();
          })
          .catch(showError);
      },
      loadTicket(ticket, mode = "save") {
        this.mode = mode;
        axios
          .get(`${baseApiUrl}/tickets/${ticket.id}`)
          .then(res => (this.ticket = res.data))
      },
      loadClients() {
        const url = `${baseApiUrl}/clientsList`;
        axios.get(url).then(res => {
          this.clients = res.data
        })
      },
      loadProblems() {
        const url = `${baseApiUrl}/problemsList`;
        axios.get(url).then(res => {
          this.problems = res.data.map(problem => {
            return { ...problem, value: problem.id, text: problem.description }
          })
        })
      },
      loadUsers() {
        const url = `${baseApiUrl}/usersList`;
        axios.get(url).then(res => {
          this.users = res.data.map(user => {
            return { ...user, value: user.id, text: user.name };
          })
        })
      },
      loadSoftwares() {
      const url = `${baseApiUrl}/softwaresList`
      axios.get(url).then(res => {
        this.softwares = res.data.map(software => {
          return {...software, value: software.id, text: software.nameSoftware }
        })
      })
    },
    },

    watch: {
      page() {
        this.loadTickets();
      }
    },
    mounted() {
      this.loadTickets()
      this.loadClients()
      this.loadProblems()
      this.loadSoftwares()
      this.loadUsers()
    }
  };
</script>

<style>
  .filtro {
    padding-top: 60px;
  }
</style>