<template>
  <v-container>
    <v-layout row wrap align-center justify-center class="mx-1">
      <v-flex xs12>
        <myAlert v-if="error" @dismissed="onDismissed" :text="error"></myAlert>
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark :to="{name: 'Dashboard'}">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Settings</v-toolbar-title>
            <div class="flex-grow-1"></div>
            <v-toolbar-items>
              <v-btn dark text @click="saveSetting" :disabled="loading" :loading="loading">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-list three-line subheader>
            <v-subheader>General</v-subheader>
            <v-list-item>
              <v-col cols="12">
                <v-subheader class="pl-0 mb-2">How many orders would you like to load</v-subheader>
                <v-slider v-model="userProfile.limitedOrder" :max="60" :min="0" :thumb-color="'red'" :thumb-size="24" thumb-label="always"></v-slider>
              </v-col>
            </v-list-item>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar color="success" v-model="snackbar.snackbar" :timeout="snackbar.timeout">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../fb");
export default {
  data() {
    return {
      snackbar: {
        snackbar: false,
        text: null,
        timeout: 2000
      }
    };
  },
  methods: {
    saveSetting() {
      this.$store.commit("setLoading", true);
      fb.usersCollection
        .doc(this.currentUser.uid)
        .update({
          limitedOrder: this.userProfile.limitedOrder
        })
        .then(() => {
          // this.$store.commit("setUserProfile", {
          //   ...this.userProfile,
          //   ...{ limitedOrder: this.limitedOrder }
          // });
          this.snackbar.snackbar = true;
          this.snackbar.text = "setting update successfully";
          this.$store.commit("setLoading", false);
        })
        .catch(err => {
          this.$store.commit("setLoading", false);
          this.$store.commit("setError", err.message);
        });
    },
    onDismissed() {
      this.$store.commit("clearError");
    }
  },
  computed: {
    ...mapState(["error", "loading", "currentUser", "userProfile"])
  }
};
</script>