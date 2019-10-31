<template>
    <div class="ticket">
        <PageTitle icon="fa fa-headset" main="Atendimentos"
            sub="Cadastros & Cia" />
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="Atendimentos" active>
                       <CadTicket />
                    </b-tab>
                </b-tabs>
            </b-card>
    </div>
</template>

<script>
import PageTitle from '../dashboard/template/PageTitle'
import CadTicket from './CadTicket'

export default {
    name: 'Ticket',
    components: { PageTitle, CadTicket },
    
}
</script>

<style>
    .stats {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
</style>