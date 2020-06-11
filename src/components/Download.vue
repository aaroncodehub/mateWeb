<template>
<v-container>
  <v-layout row align-center justify-center class="mx-1">
    <v-flex>
        <v-expansion-panels 
        focusable
        v-model="panel"
        multiple
        >
       
        <v-expansion-panel
        >
          <v-expansion-panel-header>
            <h1 class="display-1 font-weight-thin mb-4">Get the app on your phone and tablet</h1>
            <h4 class="subheading d-none d-lg-flex d-lg-none">Available on the App Store and Google Play</h4>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
              <v-container fluid>
                <v-row align="center" justify="space-around">
                  <v-col sm="2">
                    <v-img
                      src="../assets/apple.jpg"
                    ></v-img>
                  </v-col>
                  <v-col sm="2">
                    <v-img
                      src="../assets/google.jpg"
                    ></v-img>
                  </v-col>
                </v-row>
              </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
    export default {
       data() {
         return {
           panel: [0]
         }
       },  
    }
</script>

<style lang="scss" scoped>

</style>



