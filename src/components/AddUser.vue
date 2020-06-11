<template>
  <v-container>
    <v-layout row align-center justify-center class="mx-1">
      <v-flex xs12>
        <myAlert v-if="error" @dismissed="onDismissed" :text="error"></myAlert>
        <v-card>
          <form @submit.prevent="addUser">
            <v-card-title class="grey lighten-4 py-4 title">Add User</v-card-title>
            <v-container grid-list-sm class="pa-4">
              <v-layout row wrap>
                <v-flex xs12 align-center justify-space-between>
                  <v-layout align-center>
                    <v-avatar size="40px" class="mr-3">
                      <img src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png" alt />
                    </v-avatar>
                    <v-text-field label="Full Name*" v-model.trim="newUser.name" required></v-text-field>
                  </v-layout>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    prepend-icon="business"
                    label="Company Name*"
                    v-model.trim="newUser.company"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    prepend-icon="aspect_ratio"
                    label="Company Id*"
                    v-model.number="newUser.companyId"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    prepend-icon="location_on"
                    label="Company Address*"
                    v-model.trim="newUser.companyAddress"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    prepend-icon="group"
                    label="Sales Person ID*"
                    v-model.number="newUser.salesPerson"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    prepend-icon="mail"
                    label="Email*"
                    type="email"
                    v-model.trim="newUser.email"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    prepend-icon="lock"
                    label="Password*"
                    type="password"
                    v-model.trim="newUser.password"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    prepend-icon="assignment_ind"
                    label="Access Token*"
                    v-model.trim="newUser.accessToken"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    prepend-icon="call_to_action"
                    label="User ID*"
                    v-model.number="newUser.userId"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    type="tel"
                    prepend-icon="find_in_page"
                    label="Limited Order*"
                    v-model.number="newUser.limitedOrder"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    prepend-icon="contact_mail"
                    label="Email For Notice *"
                    v-model.trim="newUser.noticeEmail"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    type="tel"
                    prepend-icon="phone"
                    label="(000) 000 - 0000"
                    mask="credit-card"
                    v-model.trim="newUser.phone"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-checkbox
                    v-model="newUser.overCreditConfirmed"
                    label="Over Credit Confirmed"
                  ></v-checkbox>
                </v-flex>
                <v-flex xs6>
                  <v-text-field prepend-icon="mdi-message-text" label="Message Email*" v-model.trim="newUser.messageEmail" required></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field prepend-icon="notes" label="Notes" v-model.trim="newUser.note"></v-text-field>
                </v-flex>
                <v-flex offset-xs6>
                  <v-spacer></v-spacer>
                  <v-btn type="submit" :disabled="loading" :loading="loading" color="primary">SAVE</v-btn>
                  <v-btn text :to="{name:'Dashboard'}">CANCEL</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../fb");
export default {
  data() {
    return {
      newUser: {
        name: "",
        company: "",
        companyId: "",
        email: "",
        password: "",
        phone: "",
        note: "",
        accessToken: "",
        companyAddress: "",
        salesPerson: "",
        userId: "",
        noticeEmail:'',
        limitedOrder: null,
        overCreditConfirmed: false,
        rank: 1,
        agreement:true,
        messageEmail:""
      }
    };
  },
  computed: {
    ...mapState(["error", "loading"])
  },
  methods: {
    addUser: function() {
      this.$store.commit("setLoading", true);
      fb.auth
        .createUserWithEmailAndPassword(
          this.newUser.email,
          this.newUser.password
        )
        .then(user => {
          fb.usersCollection
            .doc(user.user.uid)
            .set({
              name: this.newUser.name,
              company: this.newUser.company,
              companyId: this.newUser.companyId,
              phone: this.newUser.phone,
              note: this.newUser.note,
              email: this.newUser.email,
              accessToken: this.newUser.accessToken,
              companyAddress: this.newUser.companyAddress,
              salesPerson: this.newUser.salesPerson,
              userId: this.newUser.userId,
              noticeEmail: this.newUser.noticeEmail,
              limitedOrder: this.newUser.limitedOrder,
              overCreditConfirmed: this.newUser.overCreditConfirmed,
              rank: this.newUser.rank,
              agreement: this.newUser.agreement,
              messageEmail: this.newUser.messageEmail
            })
            .then(() => {
              this.$store.commit("setLoading", false);
              //  SIGNOUT AFTER ADDING NEW USER
              fb.auth
                .signOut()
                .then(() => {
                  this.$store.dispatch("clearData");
                  this.$router.push("/login");
                })
                .catch(err => {
                  this.$store.commit("setLoading", false);
                  this.$store.commit("setError", err.message);
                });
            })
            .catch(err => {
              this.$store.commit("setLoading", false);
              this.$store.commit("setError", err.message);
            });
        })
        .catch(err => {
          this.$store.commit("setLoading", false);
          this.$store.commit("setError", err.message);
        });
    },
    onDismissed() {
      this.$store.commit("clearError");
    }
  }
};
</script>

