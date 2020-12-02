<template>
  <v-app class="grey lighten-4">
    <v-main>
      <Navigation v-if="currentUser"></Navigation>
    <router-view/>
    </v-main>
  </v-app>
</template>

<script>
    import { mapState } from 'vuex'
    import Navigation from './components/Navigation.vue'

    export default {
        components: { Navigation },
        computed: {
            ...mapState(['currentUser'])
        }
    }
</script>
