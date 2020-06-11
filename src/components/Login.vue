<template>
  <v-container fluid fill-height class="loginBackground">
    <v-layout row align-center justify-center>
      <v-flex sm6 md6 lg6>
        <myAlert v-if="error" @dismissed="onDismissed" :text="error"></myAlert>
        <v-card class="elevation-12">
          <v-toolbar>
            <v-toolbar-title>SHARPEYE MATE&trade;</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <form @submit.prevent="login">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      prepend-icon="person"
                      name="email"
                      label="Email"
                      id="email"
                      v-model.trim="email"
                      type="email"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      prepend-icon="lock"
                      name="password"
                      label="Password"
                      id="password"
                      v-model.trim="password"
                      type="password"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-spacer></v-spacer>
                  <v-flex offset-xs>
                    <v-btn
                      class="mx-6 px-12"
                      type="submit"
                      :disabled="loading"
                      :loading="loading"
                      color="primary"
                    >Login</v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-icon>not_listed_location</v-icon>
            <small>
              <v-btn text class="overline" @click="resetPasswordDialog = true">Forgot your password</v-btn>
            </small>
          </v-card-actions>
        </v-card>
      </v-flex>
      <!-- reset dialog -->

      <v-dialog
        v-model="resetPasswordDialog"
        persistent
        :overlay="false"
        max-width="360px"
        transition="dialog-transition"
      >
        <v-card>
          <form @submit.prevent="resetPassword">
            <v-card-title class="grey lighten-4 py-4 title">Reset your password</v-card-title>
            <v-container grid-list-sm class="pa-4">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    prepend-icon="mail"
                    label="Email*"
                    type="email"
                    v-model.trim="resetPasswordEmail"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="mx-6 px-12"
                    type="submit"
                    color="primary"
                    :disabled="loading"
                    :loading="loading"
                  >Reset</v-btn>
                  <v-btn text @click="resetPasswordDialog = false">CANCEL</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </form>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../fb");
export default {
  data() {
    return {
      email: "",
      password: "",
      resetPasswordDialog: false,
      resetPasswordEmail: null
    };
  },
  computed: {
    ...mapState(["error", "loading"])
  },
  methods: {
    login() {
      this.$store.commit("setLoading", true);
      fb.auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          this.$store.commit("setCurrentUser", user.user);
          this.$store.dispatch("fetchUserProfile");
          this.$store.commit("setLoading", false);
          this.$router.push("/dashboard");
          this.$store.commit("clearError");
        })
        .catch(err => {
          this.$store.commit("setLoading", false);
          this.$store.commit("setError", err.message);
        });
    },
    resetPassword() {
      this.$store.commit("setLoading", true);
      fb.auth
        .sendPasswordResetEmail(this.resetPasswordEmail)
        .then(() => {
          this.resetPasswordDialog = false;
          this.resetPasswordEmail = "";
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
  beforeDestroy() {
    this.$store.commit("clearError");
  }
};
</script>

<style scope>
.loginBackground {
  background-image: linear-gradient(
      rgb(255, 255, 255, 0.1),
      rgba(41, 128, 185, 0.5)
    ),
    url("../assets/login.jpg");
  background-size: cover;
  background-position: center;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
