<template>
  <div class="cad-client">
    <b-form>
      <input id="client-id" type="hidden" v-model="client.id" />
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Razão Social:" label-for="client-razao">
            <b-form-input
              id="client-razao"
              type="text"
              v-model="client.razaoSocial"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe a Razão Social..."
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="Nome Fantasia:" label-for="client-fantasia">
            <b-form-input
              id="client-fantasia"
              type="text"
              v-model="client.nomeFantasia"
              required
                :readonly="mode === 'remove'"
              placeholder="Informe o Nome Fantasia..."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-show="mode === 'save'">
        <b-col md="3" sm="12">
          <b-form-group label="CNPJ:" label-for="client-cnpj">
            <b-form-input
              id="client-cnpj"
              type="text"
              v-model="client.cnpj"
              required
              v-mask="cnpj"
              placeholder="__.___.___/____-__"
            />
          </b-form-group>
        </b-col>

        <b-col md="3" sm="12">
          <b-form-group label="IE:" label-for="client-ie">
            <b-form-input
              id="client-ie"
              type="text"
              v-model="client.ie"
              required
              v-mask="ie"
              placeholder="___.___.___.___"
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Telefone:" label-for="client-telefone">
            <b-form-input
              id="client-telefone"
              type="text"
              v-model="client.telefone"
              required
              :readonly="mode === 'remove'"
              v-mask="phone"
              placeholder= "(__) ____-____"
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Celular:" label-for="client-celular">
            <b-form-input
              id="client-celular"
              type="text"
              v-model="client.celular"
              required
              v-mask="cel"
              placeholder= "(__) _____-____"
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="Endereço:" label-for="client-endereco">
            <b-form-input
              id="client-endereco"
              type="text"
              v-model="client.endereco"
              required
              placeholder="Informe o Endereço..."
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="Email:" label-for="client-email">
            <b-form-input
              id="client-email"
              type="email"
              v-model="client.email"
              required
              placeholder="Informe o email..."
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Bairro:" label-for="client-bairro">
            <b-form-input
              id="client-bairro"
              type="text"
              v-model="client.bairro"
              required
              placeholder="Informe o Bairro..."
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="CEP:" label-for="client-cep">
            <b-form-input id="client-cep" 
            type="text" 
            v-model="client.cep" 
            v-mask="cep" 
            required 
            placeholder= "_____-___" />
          </b-form-group>
        </b-col>

        <b-col md="3" sm="12">
          <b-form-group label="Cidade:" label-for="client-cidade">
          <b-form-select
          id="client.cidade"
          :options="cidades"
          required
          v-model="client.cidade" 
          placeholder= "Selecione a Cidade"/>
          </b-form-group>
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Estado:" label-for="client-estado">
            <b-form-select
          id="client.estado"
          :options="[{ value: 1, text: 'SÃO PAULO'  }]"
          required
          v-model="client.estado" />
          </b-form-group>
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

    <b-table hover striped :items="clients" show-empty :fields="fields"  :filter="filter" 
      striped responsive="sm" :filterIncludedFields="filterOn"  @filtered="onFiltered" >
      <!-- Texto que aparece quando não possui registro ou quando não encontrou registro -->
      <template v-slot:empty="scope">
        <h4>{{ scope.emptyText }}</h4>
      </template>
      <template v-slot:emptyfiltered="scope">
        <h4>{{ scope.emptyFilteredText }}</h4>
      </template>
      <!--  botões de visualizar, alterar e excluir que aparece com registros -->
      <template slot="actions" slot-scope="data">
        <!-- botão de visualizar -->
        <b-button size="sm" variant="info" @click="data.toggleDetails" class="mr-1">
           <i class="fa fa-eye"></i>
        </b-button>
         <!-- botão de alterar -->
        <b-button variant="warning" size="sm" @click="loadClient(data.item)"  class="mr-1">
           <i class="fa fa-edit"></i>
        </b-button>
          <!-- botão de excluir -->
        <b-button variant="danger" size="sm" @click="loadClient(data.item, 'remove')" class="mr-1">
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
                <b-col sm="3" class="text-sm-right"><b>Razão Social:</b></b-col>
                <b-col>{{ row.item.razaoSocial}}</b-col>
              </b-row>
              <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Nome Fantasia:</b></b-col>
                  <b-col>{{ row.item.nomeFantasia }}</b-col>
              </b-row>
              <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>CNPJ:</b></b-col>
                  <b-col>{{ row.item.cnpj }}</b-col>
              </b-row>
              <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>IE:</b></b-col>
                  <b-col>{{ row.item.ie }}</b-col>
              </b-row>
              <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Endereço:</b></b-col>
                  <b-col>{{ row.item.endereco  }}</b-col>
              </b-row>
              <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Bairro:</b></b-col>
                  <b-col>{{ row.item.bairro  }}</b-col>
              </b-row>
              <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Cidade:</b></b-col>
                  <b-col>{{ row.item.cidade  }}</b-col>
              </b-row>
              <b-row class="mb-2">
                    <b-col sm="3" class="text-sm-right"><b>Telefone Fixo:</b></b-col>
                    <b-col>{{ row.item.telefone }}</b-col>
              </b-row>
              <b-row class="mb-2">
                    <b-col sm="3" class="text-sm-right"><b>Celular:</b></b-col>
                    <b-col>{{ row.item.celular }}</b-col>
              </b-row>
              <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Email:</b></b-col>
                  <b-col>{{ row.item.email }}</b-col>
              </b-row>
        </b-card>
      </template>
    </b-table>
    <hr/>
   <!-- paginação -->
      <b-pagination align="center" size="md" v-model="page" :total-rows="count" :per-page="limit" />
  </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'


export default {
  name: "CadClient",
  data: function() {
    return {
      mode: "save",
      client: {},
      clients: [],
      page: 1,
      limit: 0,
      filter: null,
      filterOn: [],
      count: 0,
      fields: [
        // alterando os nomes da tabelas que vem do banco,
        // sortable é utilizado para ordenação das colunas
        { key: "id", label: "Código", sortable: true },
        { key: "nomeFantasia", label: "Nome", sortable: true },
        { key: "telefone", label: "Telefone" },
        { key: "celular", label: "Celular"},
        { key: "actions", label: "Ações" }
      ],
      phone: "(##) ####-####",
      cel: "(##) #####-####",
      ie: "###.###.###.###",
      cnpj: "##.###.###/####-##",
      cep: "#####-####",
      cidades: ['Olímpia','Severinia', 'Monte Azul Paulista', 'Terra Rouxa', 'Cajobi', 'Embauba'],
     
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
    // carregar os usuários do backend
    loadClients() {
      const url = `${baseApiUrl}/clients?page=${this.page}`;
      axios.get(url).then(res => {
        this.clients = res.data.data;
        this.limit = res.data.limit;
        this.count = res.data.cout;
      });
    },
    reset() {
      // voltando pro modo salvar
      this.mode = "save";
      // zerando o form
      this.client = {};
      // carregando a tabela
      this.loadClients();
    },
    save() {
      // verificando o id do usuário, caso tiver setado irá ser put
      const method = this.client.id ? "put" : "post";
      const id = this.client.id ? `/${this.client.id}` : "";
      axios[method](`${baseApiUrl}/clients${id}`, this.client)
        .then(() => {
          // mostrando a mensagem de sucesso
          this.$toasted.global.defaultSuccess();
          // resetando o formulario e trazendo nova lista de usuário
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.client.id;
      axios
        .delete(`${baseApiUrl}/clients/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadClient(client, mode = "save") {
      this.mode = mode;
      this.client = { ...client };
    }
  },
  watch: {
    page() {
      this.loadClients();
    }
  },
  mounted() {
    this.loadClients();
  }
};
</script>

<style>
  .filtro {
        padding-top:  60px;
    }

</style>
