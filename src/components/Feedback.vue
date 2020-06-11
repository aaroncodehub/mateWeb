<template>
  <v-card
    class="elevation-16 mx-auto"
    width="600"
  >
    <v-card-title
      class="headline"
      primary-title
    >
      Rate Our Application
    </v-card-title>
    <v-card-text>
      If you enjoy using SHARPEYEMATE, please take a few seconds to rate your experience with the application. It really helps!

      <div class="text-center mt-12">
        <v-rating
          v-model="rating"
          color="yellow darken-3"
          background-color="grey darken-1"
          empty-icon="$ratingFull"
          half-increments
          hover
        ></v-rating>
      </div>
        <v-textarea
          outlined
          label="Write a Review"
          v-model.trim="review"
        ></v-textarea>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="justify-space-between">
      <v-btn text :to="{ name: 'Dashboard' }">No Thanks</v-btn>
      <v-btn
        color="primary"
        @click="WriteReview"
      >
        Submit
      </v-btn>
    </v-card-actions>
    <v-snackbar
      color="success"
      v-model="snackbar.snackbar"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
      <v-btn text @click="snackbar.snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../fb");
    export default {
        data() {
            return {
                rating: 4.5,
                review:'',
                snackbar: {
                snackbar: false,
                text: null,
                timeout: 2000,
      },
            }
        },
        computed: {
          ...mapState(["currentUser"])
        },
        methods: {
          WriteReview: function(){
            fb.feedbackCollection.doc(this.currentUser.uid).set({
              rating: this.rating,
              review: this.review,
              email: this.currentUser.email
            })
            .then(()=>{
                this.snackbar.text = 'Submited successfully. Thank you'
                this.snackbar.snackbar = true;
            })
          }
        },
    }
</script>

<style lang="scss" scoped>

</style>