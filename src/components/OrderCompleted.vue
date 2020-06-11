<template>
  <v-container grid-list-xs v-if="loading">
    <v-row class="fill-height" align-content="center" justify="center">
      <v-col class="subtitle-1 text-center" cols="12">Getting your orders</v-col>
      <v-col cols="6">
        <v-progress-linear color="primary" indeterminate rounded height="6"></v-progress-linear>
      </v-col>
    </v-row>
  </v-container>
  <v-container fluid grid-list-md v-else>
    <!-- <myAlert v-if="error" @dismissed="onDismissed" :text="error"></myAlert> -->
    <v-alert v-if="error" border="top" colored-border type="error" elevation="2">
      {{ error }} ! Oops. something went wrong , please try again
      later.
    </v-alert>

    <v-data-table :headers="headers" :items="ordersCompleted" :search="search" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Orders Completed</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search your order"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>

      
      <template v-slot:body="{ items }">
        <tbody>
          <tr v-for="item in items" :key="item.name">
            <td :class="`pa-2 order ${item.sales_order_status}`" >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">{{ item.sales_order_status }}</span>
                  </template>
                  <span>It has been confirmed by sharpeye</span>
                </v-tooltip>
              </td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">{{item.manufacturing_status_of_sales_order}}</span>
                  </template>
                  <span>The glass is ready to go</span>
                </v-tooltip>
              </td>
            <td>{{item.name}}</td>
            <td>{{ item.client_order_ref|lessLetters }}</td>
            <td>{{ item.customer_request|lessLetters }}</td>
            <td>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn small text @click="openMoreDialog(item)" v-on="on" icon>
                      <v-icon color="primary" class="mr-2">remove_red_eye</v-icon>
                    </v-btn>
                  </template>
                  <span>Review Your Order</span>
                </v-tooltip>
            </td>
          </tr>
        </tbody>
      </template>

    </v-data-table>

    <!-- More Dialog -->
    <v-dialog
      v-model="dialog.moreDialog"
      persistent
      :overlay="false"
      max-width="1200px"
      transition="dialog-transition"
    >
      <v-stepper v-model="stepMore" vertical>
        <v-stepper-step :complete="stepMore > 1" step="1">
          Sales order details -- {{ order.name }}
          <small>sales order information</small>
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-card flat color="grey lighten-5" class="mb-6 px-2">
            <v-layout wrap>
              <v-flex xs12 md6>
                <v-text-field
                  prepend-icon="location_on"
                  label="Shipping Address"
                  v-model.trim="order.alternate_shipping_address"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  prepend-icon="description"
                  label="Reference/Description"
                  v-model.trim="order.client_order_ref"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field
                  prepend-icon="contacts"
                  label="Contact Name"
                  v-model.trim="order.contact_name"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field
                  prepend-icon="phone"
                  label="Contact Phone"
                  v-model.trim="order.mobile"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md4>
                <v-select
                  prepend-icon="local_shipping"
                  v-model="order.delivery_method"
                  :items="deliver"
                  label="Deliver Method"
                ></v-select>
              </v-flex>
              <v-flex v-if="order.customer_request" >
                    <v-textarea
                      prepend-icon="info"
                      label="Special Request"
                      v-model.trim="order.customer_request"
                    ></v-textarea>
              </v-flex>
            </v-layout>
            <v-layout wrap v-for="(orderLine, index) in order.order_lines" v-bind:key="index">
              <v-layout
                wrap
                v-if="
                    orderLine.product_id[0] == 2380 ||
                    orderLine.product_id[0] == 22 ||
                    orderLine.product_id[0] == 23 ||
                    orderLine.product_id[0] == 24 ||
                    orderLine.product_id[0] == 25 ||
                    orderLine.product_id[0] == 2522 ||
                    orderLine.product_id[0] == 2303 ||
                    orderLine.product_id[0] == 26 ||
                    orderLine.product_id[0] == 27 ||
                    orderLine.product_id[0] == 28 ||
                    orderLine.product_id[0] == 29 ||
                    orderLine.product_id[0] == 2083 ||
                    orderLine.product_id[0] == 2529 ||
                    orderLine.product_id[0] == 30 ||
                    orderLine.product_id[0] == 2530
                "
              >
                <v-flex xs12 md4>
                  <v-select
                    v-model="orderLine.product_id[0]"
                    :items="products"
                    item-text="product"
                    item-value="value"
                    label="Product"
                  ></v-select>
                </v-flex>
                <v-flex xs12 md2>
                  <v-text-field v-model.number="orderLine.width" label="Width"></v-text-field>
                </v-flex>
                <v-flex xs12 md2>
                  <v-text-field v-model.number="orderLine.height" label="Height"></v-text-field>
                </v-flex>
                <v-flex xs12 md2>
                  <v-text-field v-model.number="orderLine.number_of_pieces" label="PCs"></v-text-field>
                </v-flex>
                <v-flex xs12 md2>
                  <v-select
                    v-model="orderLine.ynt_selection"
                    :items="drawings"
                    label="Flag"
                    item-text="flag"
                    item-value="value"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-card>
          <v-btn color="primary" @click="dialog.moreDialog = false">close</v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      headers: [
        { text: "Sales Order Status", value: "sales_order_status" },
        {
          text: "Manufacturing Status",
          value: "manufacturing_status_of_sales_order"
        },
        {
          text: "Sales Oder Number",
          align: "left",
          value: "name"
        },
        { text: "Reference/Description", value: "client_order_ref" },
        { text: "Special Request", value: "customer_request" },
        { text: "Actions", value: "action", sortable: false }
      ],
      search: "",
      dialog: {
        moreDialog: false
      },
      order: {
        id: null,
        name: null,
        alternate_shipping_address: null,
        client_order_ref: null,
        contact_name: null,
        mobile: null,
        delivery_method: null,
        customer_request: null,
        order_lines: null
      },
      step: 1,
      stepMore: 1,
      products: [
        { product: "LMG-4MM", value: 2380 },
        { product: "LMG-5MM", value: 22 },
        { product: "LMG-5MM-LOW-IRON", value: 23 },
        { product: "LMG-5MM-SILVER-MIRRO", value: 24 },
        { product: "LMG-6MM", value: 25 },
        { product: "LMG-6MM-SILVER-MIRRO", value: 2522 },
        { product: "LMG-6.38MM-LAMINATED", value: 2303 },
        { product: "LMG-8MM", value: 26 },
        { product: "LMG-10MM", value: 27 },
        { product: "LMG-12MM", value: 28 },
        { product: "LMG-12MM-EUROGREY", value: 29 },
        { product: "LMG-12MM-GREEN", value: 2083 },
        { product: "LMG-12MM-ULTRA-CLEAR", value: 2529 },
        { product: "LMG-15MM", value: 30 },
        { product: "LMG-15MM-ULTRA-CLEAR", value: 2530 }
      ],
      drawings: [
        { flag: "Drawing", value: "y" },
        { flag: "Dimension", value: "n" },
        { flag: "Template", value: "t" }
      ],
      deliver: ["pick_up", "deliver", "freight"]
    };
  },
  methods: {
    openMoreDialog(order) {
      if (order.client_order_ref) {
        this.order.client_order_ref = order.client_order_ref;
      } else {
        this.order.client_order_ref = "";
      }
      this.order.id = order.id;
      this.order.name = order.name;
      this.dialog.moreDialog = true;
      if (order.alternate_shipping_address) {
        this.order.alternate_shipping_address =
          order.alternate_shipping_address;
      } else {
        this.order.alternate_shipping_address = "";
      }
      if (order.contact_name) {
        this.order.contact_name = order.contact_name;
      } else {
        this.order.contact_name = "";
      }
      if (order.mobile) {
        this.order.mobile = order.mobile;
      } else {
        this.order.mobile = "";
      }
      this.order.customer_request = order.customer_request;
      this.order.delivery_method = order.delivery_method;
      this.order.order_lines = order.order_line;
    }
  },
  computed: {
    ...mapState(["userProfile", "orders", "error", "loading"]),
    ordersCompleted() {
      let orders = this.orders.filter(
        order => order.manufacturing_status_of_sales_order == "done"
      );
      return orders;
    }
  },
    filters:{
    lessLetters: function(value){
     if(value.length > 20) {
       value = value.slice(0,20) + ` ...`
       return value
     }else if (value){
       return value
     }
      return ''
    }
  },
  beforeDestroy() {
    this.$store.commit("clearError");
  }
};
</script>
