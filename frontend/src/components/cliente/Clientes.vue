<template>
    <div class="cliente">
        <PageTitle icon="fa fa-user" main="Clientes"
            sub="Cadastros & Cia" />
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="Cadastro" active>
                        <CadCLiente />
                    </b-tab>
                </b-tabs>
            </b-card>
    </div>
</template>

<script>
import PageTitle from '../dashboard/template/PageTitle'
import CadCLiente from '../cliente/CadCliente'


export default {
    name: 'Cliente',
    components: { PageTitle, CadCLiente },
    
}
</script>

<style>
    .stats {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
</style>