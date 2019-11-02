<template>
    <div class="software">
        <PageTitle icon="fa fa-desktop" main="Softwares"
            sub="Cadastros & Cia" />
            <b-card no-body>
                 <b-tabs card>
                     <b-tab title="Softwares" active>
                        <CadSoftware />
                    </b-tab>
                    <b-tab title="Base de Conhecimentos" >
                        <CadProblem />
                    </b-tab>

                </b-tabs>
            </b-card>
    </div>
</template>

<script>
import PageTitle from '../dashboard/template/PageTitle'
import CadProblem from './CadProblem'
import CadSoftware from './CadSoftware'


export default {
    name: 'SoftwaresPages',
    components: { CadProblem, CadSoftware, PageTitle }
}
</script>

<style>
    
    h1 {
        padding-bottom: 10px;
    }

</style>