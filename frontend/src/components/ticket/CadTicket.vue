<template>
  <div class="ticket">
    <b-form>
      <input id="ticket-id" type="hidden" v-model="ticket.id" />

      <!---- Input do Cliente ---->
      <b-row>
        <b-col md="6" sm="12">
           <b-form-group label="Cliente:" label-for="ticket-cliente">
            <v-select :options="options" v-model="ticket.clientId"/>
          </b-form-group>
          </b-col>

        <!----- Input da Data ---->
        <b-col md="3" sm="12">
          <b-form-group
            :readonly="mode === 'remove'"
           label="Data:"
           placeholder="__/__/____"
           label-for="ticket-date"
           >

            <b-form-input
            id="type-date"
            :readonly="mode === 'remove'"
            type="text"
            v-model="ticket.date"
            v-mask="date"
            placeholder="__/__/____"
            >
            </b-form-input>
          </b-form-group>
        </b-col>

      <!----- Input do Status ---->
        <b-col md="3" sm="12">
          <b-form-group
           label="Status:"
           label-for="ticket-status">

          <b-form-select
            id="ticket-status"
           :options="status"
           v-model="ticket.status"
           :readonly="mode === 'remove'"
            />
          </b-form-group>
        </b-col>
      </b-row>

      <!----- Input do Problema ---->
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group
           v-if="mode === 'save'"
            label="Problema:"
            label-for="ticket-problemId">

           <b-form-select id="ticket-problemId"
            :options="problems"
            v-model="ticket.problemId">
            </b-form-select>
          </b-form-group>
        </b-col>

       <!----- Input do Solicitante ---->
        <b-col md="3" sm="12">
          <b-form-group
          v-if="mode === 'save'"
          label="Solicitante:"
          label-for="ticket-solicitante">

        <b-form-input
          id="ticket-solicitante"
          v-model="ticket.solicitante"
           />
          </b-form-group>
        </b-col>

        <!----- Input do Atendente ---->
        <b-col md="3" sm="12">
          <b-form-group
          v-if="mode === 'save'"
          label="Atendente:"
          label-for="ticket-userId">

        <b-form-select
          id="ticket-user_id"
          :options="users"
          v-model="ticket.userId" />
          </b-form-group>
        </b-col>
      </b-row>

        <!----- Input da Solucao---->
      <b-form-group
         v-if="mode === 'save'"
         label="Solução"
         label-for="ticket-content">

        <VueEditor v-model="ticket.description"
        placeholder="Informe a Solução..." />
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

    <!----- tabelas ---->
    <b-table hover striped :items="tickets" show-empty :fields="fields" :filter="filter"
      :filterIncludedFields="filterOn"  @filtered="onFiltered">
      <template v-slot:empty="scope">
        <h4>{{ scope.emptyText }}</h4>
      </template>
      <template v-slot:emptyfiltered="scope">
        <h4>{{ scope.emptyFilteredText }}</h4>
      </template>
      <template slot="actions" slot-scope="data">
        <!-- botões de alterar da tabela -->
        <b-button variant="warning" @click="loadTicket(data.item)" class="mr-2">
            <i class="fa fa-edit"></i>
        </b-button>
        <b-button variant="danger" @click="loadTicket(data.item, 'remove')">
          <i class="fa fa-trash"></i> 
        </b-button>
      </template>
    </b-table>
      <!-- paginação -->
    <b-pagination size="md" v-model="page" :total-rows="total" :per-page="perPage" />
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
  components: { VueEditor,  vSelect },
  data: function() {
    return {
      mode: "save",
      clientId: null,
      ticket: {},
      tickets: [],
      softwares: [],
      options: [],
      users: [],
      problems: [],
      filter: null,
      filterOn: [],
      // paginação
      page: 1,
      perPage: 0,
      total: 0,
      // cabeçalho da tabela
      fields: [
        { key: "id", label: "Código", sortable: true },
        { key: "clientId", label: "Cliente", sortable: true },
        { key: "problemId", label: "Problema", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "actions", label: "Ações" }
      ],
      status: [ 'RESOLVIDO', 'PENDENTE'],
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
      }
    },
  methods: {
    onFiltered(filteredItems) {
       // Dispara a paginação para atualizar o número de botões / páginas devido à filtragem
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
    loadTickets() {
      const url = `${baseApiUrl}/tickets?page=${this.page}`;
      axios.get(url).then(res => {
        this.tickets = res.data.data;
        this.total = res.data.total;
        this.perPage = res.data.perPage
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
    loadSoftwares() {
      const url = `${baseApiUrl}/softwaresList`
      axios.get(url).then(res => {
        this.softwares = res.data.map(software => {
          return { value: software.id, text: `${software.nameSoftware} ` }
        })
      })
    },
    loadClients() {
      const url = `${baseApiUrl}/clientsList`;
      axios.get(url).then(res => {
        this.clients = res.data.map(client => {
          return this.options.push(client.nomeFantasia)
        })
      })
    },
    loadProblems() {
      const url = `${baseApiUrl}/problemsList`;
      axios.get(url).then(res => {
        this.problems = res.data.map(problem => {
          return { value: problem.id, text: `${problem.description} ` }
        })
      })
    },
    loadUsers() {
      const url = `${baseApiUrl}/usersList`;
      axios.get(url).then(res => {
        this.users = res.data.map(user => {
          return { value: user.id, text: `${user.name} ` };
        })
      })
    }
  },
  
  watch: {
    page() {
      this.loadTickets();
    }
  },
  mounted() {
    this.loadSoftwares()
    this.loadTickets()
    this.loadClients()
    this.loadProblems()
    this.loadUsers()
  }
};
</script>

<style>
    .filtro {
        padding-top:  60px;
    }
</style>
