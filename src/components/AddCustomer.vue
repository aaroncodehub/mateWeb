<template>
  <v-container>
    <v-layout row align-center justify-center class="mx-1">
      <v-flex xs12>
        <myAlert v-if="error" @dismissed="onDismissed" :text="error"></myAlert>
        <v-card>
          <form @submit.prevent="addCustomer">
            <v-card-title class="grey lighten-4 py-4 title">Add Customer</v-card-title>
            <v-container grid-list-sm class="pa-4">
              <v-layout row wrap>
                <v-flex xs6>
                  <v-text-field
                    prepend-icon="business"
                    label="Company Name*"
                    v-model.trim="customer.name"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    prepend-icon="aspect_ratio"
                    label="Company Id*"
                    v-model.number="customer.partner_id"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    prepend-icon="location_on"
                    label="Company Address*"
                    v-model.trim="customer.alternate_shipping_address"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    prepend-icon="call_to_action"
                    label="Salesperson ID*"
                    v-model.number="customer.salespersonId"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    prepend-icon="contact_mail"
                    label="Contact Name *"
                    v-model.trim="customer.contact_name"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    type="tel"
                    prepend-icon="phone"
                    label="(000) 000 - 0000"
                    mask="credit-card"
                    v-model.trim="customer.mobile"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field prepend-icon="notes" label="Notes" v-model.trim="customer.note"></v-text-field>
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
      customer: {
        name: "",
        partner_id: "",
        mobile: "",
        note: "",
        alternate_shipping_address: "",
        salespersonId: "",
        contact_name: "",
      },
    };
  },
  computed: {
    ...mapState(["error", "loading","userProfile"]),
  },
  methods: {
    addCustomer: function () {
      this.$store.commit("setLoading", true);
      fb.customersCollection
        .doc()
        .set({
          name: this.customer.name,
          partner_id: this.customer.partner_id,
          mobile: this.customer.mobile,
          note: this.customer.note,
          alternate_shipping_address: this.customer.alternate_shipping_address,
          salespersonId: this.customer.salespersonId,
          contact_name: this.customer.contact_name,
        })
        .then(() => {
          this.$store.commit("setLoading", false);
          //  SIGNOUT AFTER ADDING NEW USER
        })
        .then(() => {
          this.$router.push("/dashboard");
        })
        .catch((err) => {
          this.$store.commit("setLoading", false);
          this.$store.commit("setError", err.message);
        });
    },
    onDismissed() {
      this.$store.commit("clearError");
    },
  },
  updated() {
    if (this.userProfile.rank <= 6) {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch("clearData");
          this.$router.push("/login");
        })
        .catch((err) => {
          this.$store.commit("setLoading", false);
          this.$store.commit("setError", err.message);
        });
    }
  },
};
</script>

