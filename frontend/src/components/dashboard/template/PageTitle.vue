<template>
    <div class="page-title">
        <h1><i v-if="icon" :class="icon"></i> {{ main }}</h1>
    </div>
</template>

<script>
export default {
    name: 'PageTitle',
    props: ['icon', 'main', 'sub']
}
</script>

<style>
    .page-title h1 {
        margin: 0px;
        font-size: 24px;
        padding-bottom: 10px;
    }

    .page-title h2 {
        color: #777;
        margin-top: 1px;
        font-size: 12px;
        font-weight: 300;
    }
    .page-title hr {
        margin-top: 0px;
    }
</style>
