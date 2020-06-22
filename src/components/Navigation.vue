<template>
  <v-content>
    <v-navigation-drawer fixed clipped v-model="drawer" app light>
      <v-list dense>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon medium>person_pin</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ currentUser.email }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>

        <v-list-item v-for="item in menus" :key="item.title" :to="item.link">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <!-- <v-list-item :to="{name:'Message'}">
          <v-list-item-action>
            <v-badge
              v-model="showBadge"
              overlap
              color="error"
            >
              <template v-slot:badge>
                <span>6</span>
              </template>
              <v-icon >mail</v-icon>
            </v-badge>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1">Message</v-list-item-title>
        </v-list-item>-->

        <v-list-item :to="{ name: 'AddUser' }" v-if="this.userProfile.rank >= 3">
          <v-list-item-action>
            <v-icon color="red">group_add</v-icon>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1">Add User</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'AddCustomer' }" v-if="this.userProfile.rank >= 3">
          <v-list-item-action>
            <v-icon color="red">add_business</v-icon>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1">Add Customer</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'CreateOrderByExcel' }" v-if="this.userProfile.rank >= 2">
          <v-list-item-action>
            <v-icon color="red">control_point_duplicate</v-icon>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1">Create By Excel</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item :to="{ name: 'Help' }">
          <v-list-item-action>
            <v-icon color="grey darken-1">help</v-icon>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1">Needs Help</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'Feedback' }">
          <v-list-item-action>
            <v-icon color="grey darken-1">sms</v-icon>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1">Send feedback</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'Download' }">
          <v-list-item-action>
            <v-icon color="grey darken-1">phonelink</v-icon>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1">App downloads</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-icon color="grey darken-1">keyboard</v-icon>
          </v-list-item-action>
          <v-list-item-title>
            <a
              href="http://www.sharpeye.co.nz"
              target="_blank"
              style="text-decoration:none"
              class="grey--text text--darken-1"
            >Go to Website</a>
          </v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon color="primary">exit_to_app</v-icon>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1">Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- adjust HEIGHT to adapt content -->
    <v-app-bar
      color="secondary"
      dense
      fixed
      clipped-left
      app
      class="white--text"
      prominent
      src="../assets/header.jpg"
      height="80px"
    >
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(55,236,186,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="white--text"></v-app-bar-nav-icon>
      <v-toolbar-title class="mr-5 align-center">
        <span class="font-weight-light">Sharpeye</span>
        <router-link to="/" tag="span" style="cursor: pointer">Mate&trade;</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="font-weight-light mt-5 d-none d-sm-flex">
        {{
        userProfile.company
        }}
      </span>
      <v-layout row align-center style="max-width: 650px">
        <!-- <v-text-field
            placeholder="Search..."
            single-line
            class="searchBar"
            append-icon="search"
            color="white"
            hide-details
          >
        </v-text-field>-->

        <v-spacer></v-spacer>

        <!-- <v-badge
          v-model="showBadge"
          overlap
          color="error"
        >
          <template v-slot:badge>
            <span>6</span>
          </template>
           <v-icon class="white--text">notifications_active</v-icon>
        </v-badge>-->
        <v-btn icon>
          <v-icon class="white--text">apps</v-icon>
        </v-btn>
      </v-layout>
    </v-app-bar>
  </v-content>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../fb");
export default {
  name: "Navbar",
  data() {
    return {
      showBadge: true,
      drawer: true,
      menus: [
        { icon: "add_circle", title: "Create Order", link: "/createOrder" },
        { icon: "list", title: "Sales Orders", link: "/dashboard" },
        {
          icon: "local_shipping",
          title: "Order Completed",
          link: "/orderCompleted"
        },
        {
          icon: "rowing",
          title: "Order Ongoing",
          link: "/orderOngoing"
        },
        { icon: "search", title: "Search More", link: "/search" },
        { icon: "settings", title: "Settings", link: "/settings" }
      ]
    };
  },
  computed: {
    ...mapState(["currentUser", "userProfile"])
  },
  methods: {
    logout() {
      fb.auth.signOut().then(() => {
        this.$store.dispatch("clearData");
        this.$router.push("/login");
      });
    }
  }
};
</script>

<style>
.searchBar .v-input__icon--append .v-icon {
  color: white;
}
</style>
