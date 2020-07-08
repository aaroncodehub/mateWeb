<template>
  <v-container>
    <v-layout row align-center justify-center class="mx-1">
      <v-flex>
        <v-expansion-panels focusable v-model="panel" multiple>
          <v-expansion-panel>
            <v-expansion-panel-header>Sharpeye Mate Tutorial</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container fluid>
                <v-row>
                  <v-col>
                    <iframe
                      width="810"
                      height="426"
                      src="https://www.youtube.com/embed/zqZqNWjBfKI"
                      frameborder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>How Can I Create Sales Order ?</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-img src="../assets/manual/createOrder01.jpg"></v-img>
                  </v-col>

                  <v-col>
                    <v-img src="../assets/manual/createOrder02.jpg"></v-img>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>How Can I Edit Sales Order ?</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-img src="../assets/manual/edit.jpg"></v-img>
                  </v-col>
                  <v-col>
                    <v-img src="../assets/manual/edit02.jpg"></v-img>
                  </v-col>
                  <v-col>
                    <v-img src="../assets/manual/edit03.jpg"></v-img>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>How Can I Delete Sales Order ?</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-img src="../assets/manual/delete.jpg"></v-img>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>How Can I Upload My drawing ?</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-img src="../assets/manual/upload.jpg"></v-img>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>How Could I Change My Password ?</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-img src="../assets/manual/reset.jpg"></v-img>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>Why I Can't Upload Drawing , Edit and Delete Sales Order ?</v-expansion-panel-header>
            <v-expansion-panel-content>
              Please note that you have to contact Sharpeye to do any changes if the sales order is confirmed.
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-img src="../assets/manual/dashboard.jpg"></v-img>
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
    };
  }
};
</script>

<style lang="scss" scoped>
</style>