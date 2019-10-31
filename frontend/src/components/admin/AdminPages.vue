<template>
    <div class="admin-pages">
        <PageTitle icon="fa fa-cogs" main="Administração do Sistema"
            sub="Cadastros & Cia" />
        <div class="admin-pages-tabs">
            <b-card no-body>
                <b-tabs card >
                    <b-tab title="Usuários">
                        <User />
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>
import PageTitle from '../dashboard/template/PageTitle'
import User from './User'


export default {
    name: 'AdminPages',
    components: { PageTitle, User }
}
</script>

<style>

</style>
