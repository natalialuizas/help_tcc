<template>
    <div class="user-admin">
        <!-- inicio do formulário -->
        <b-form>
            <input id="user-id" type="hidden" v-model="user.id" />
            <b-row>
                <!-- input de nome -->
                <b-col md="6" sm="12">
                    <b-form-group label="Nome:" label-for="user-name">
                        <b-form-input id="user-name" type="text"
                            v-model="user.name" required
                            :readonly="mode === 'remove'"
                            placeholder="Informe o Nome do Usuário..." />
                    </b-form-group>
                </b-col>
                  <!-- input de email -->
                <b-col md="6" sm="12">
                    <b-form-group label="E-mail:" label-for="user-email">
                        <b-form-input id="user-email" type="text"
                            v-model="user.email" required
                            :readonly="mode === 'remove'"
                            placeholder="Informe o E-mail do Usuário..." />
                    </b-form-group>
                </b-col>
            </b-row>
              <!-- checkbox do administrador -->
            <b-form-checkbox id="user-admin" v-show="mode === 'save'"
                v-model="user.admin" class="mt-3 mb-3">
                Administrador?
            </b-form-checkbox>
              <!-- input de senha -->
            <b-row v-show="mode === 'save'">
                <b-col md="6" sm="12">
                    <b-form-group label="Senha:" label-for="user-password">
                        <b-form-input id="user-password" type="password"
                            v-model="user.password" required
                            placeholder="Informe a Senha do Usuário..." />
                    </b-form-group>
                </b-col>
             <!-- input de confirmação de senha -->
                <b-col md="6" sm="12">
                    <b-form-group label="Confirmação de Senha:" 
                        label-for="user-confirm-password">
                        <b-form-input id="user-confirm-password" type="password"
                            v-model="user.confirmPassword" required
                            placeholder="Confirme a Senha do Usuário..." />
                    </b-form-group>
                </b-col>
            </b-row>
              <!-- botões -->
            <b-row>
                <b-col xs="12">
                    <!-- salvar -->
                    <b-button variant="primary" v-if="mode === 'save'"
                        @click="save">Salvar</b-button>
                    <!-- excluir -->
                    <b-button variant="danger" v-if="mode === 'remove'"
                        @click="remove">Excluir</b-button>
                    <b-button class="ml-2" @click="reset">Cancelar</b-button>
                </b-col>
            </b-row>
        </b-form>
        <!-- final do formulário -->

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

    <!-- tabela  -->
      <b-table hover striped responsive :items="users" show-empty :fields="fields" :filter="filter"
       responsive :filterIncludedFields="filterOn"  @filtered="onFiltered">
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
                <b-button variant="warning" size="sm" @click="loadUser(data.item)" class="mr-1">
                    <i class="fa fa-edit"></i>
                </b-button>
                <!-- botão de excluir -->
                <b-button variant="danger" size="sm" @click="loadUser(data.item, 'remove')" class="mr-1">
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
                  <b-col sm="3" class="text-sm-right"><b>Nome:</b></b-col>
                  <b-col>{{ row.item.name }}</b-col>
                </b-row>
                <b-row class="mb-2">
                    <b-col sm="3" class="text-sm-right"><b>Email:</b></b-col>
                    <b-col>{{ row.item.email }}</b-col>
                  </b-row>
                <b-row class="mb-2">
                    <b-col sm="3" class="text-sm-right"><b>Admin:</b></b-col>
                    <b-col>{{ row.item.admin }}</b-col>
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

export default {
    name: 'UserAdmin',
    data: function() {
        return {
            mode: 'save',
            filter: null,
            filterOn: [],
            user: {},
            users: [],
            page: 1,
            limit: 0,
            count: 0,
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'email', label: 'E-mail', sortable: true },
                { key: 'admin', label: 'Administrador', sortable: true,
                    formatter: value => value ? 'Sim' : 'Não' },
                { key: 'actions', label: 'Ações' }
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
     onFiltered(filteredItems) {
       // Dispara a paginação para atualizar o número de botões / páginas devido à filtragem
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },

     // carregar os usuários do backend
    loadUsers() {
      const url = `${baseApiUrl}/users?page=${this.page}`;
      axios.get(url).then(res => {
        this.users = res.data.data
        this.count = res.data.count
        this.limit = res.data.limit
      });
    },
        reset() {
            this.mode = 'save'
            this.user = {}
            this.loadUsers()
        },
        save() {
            const method = this.user.id ? 'put' : 'post'
            const id = this.user.id ? `/${this.user.id}` : ''
            axios[method](`${baseApiUrl}/users${id}`, this.user)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.user.id
            axios.delete(`${baseApiUrl}/users/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadUser(user, mode = 'save') {
            this.mode = mode
            this.user = { ...user }
        }
    },
    mounted() {
        this.loadUsers()
    },
    watch: {
    page() {
      this.loadUsers()
    }
  }
}
</script>

<style>
    .filtro {
        padding: 15px 0px;
        margin: 0px;
        text-align:right;
    }

</style>
