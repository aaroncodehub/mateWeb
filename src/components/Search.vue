<template>
  <v-card flat class="mx-8 grey lighten-5">
    <v-layout row wrap>
      <v-flex xs12 class="mt-20">
        <myAlert v-if="error" @dismissed="onDismissed" :text="error"></myAlert>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 md10>
        <v-text-field
          append-icon="mic"
          class="mt-2 ml-4"
          flat
          hide-details
          label="Search your order"
          prepend-inner-icon="search"
          v-model.trim="search"
        ></v-text-field>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs12 md2>
        <v-btn
          @click="searchOrder"
          color="primary"
          class="mt-4 ml-4"
          :disabled="loading"
          :loading="loading"
        >SEARCH</v-btn>
      </v-flex>

      <v-flex xs12>
        <v-card v-if="order.id" class="mx-auto mt-2 pl-12">
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>
                <div class="caption grey--text">Sales order number</div>
                <div class="title">{{ order.name }}</div>
              </v-flex>
              <v-flex xs6 md4>
                <div class="caption grey--text">Sales order status</div>
                <div class="subtitle-1">{{ order.sales_order_status }}</div>
              </v-flex>
              <v-flex xs6 md4>
                <div class="caption grey--text">Manufacturing status</div>
                <div class="subtitle-1">{{ order.manufacturing_status_of_sales_order }}</div>
              </v-flex>
              <v-flex xs6 md4>
                <div class="caption grey--text">Reference/Description</div>
                <div v-if="order.client_order_ref" class="subtitle-1">{{ order.client_order_ref }}</div>
              </v-flex>
              <v-flex xs6 md4>
                <div class="caption grey--text">Shipping address</div>
                <div
                  v-if="order.alternate_shipping_address"
                  class="subtitle-1"
                >{{ order.alternate_shipping_address }}</div>
              </v-flex>
              <v-flex xs6 md4>
                <div class="caption grey--text">Contact name</div>
                <div v-if="order.contact_name" class="subtitle-1">{{ order.contact_name }}</div>
              </v-flex>
              <v-flex xs6 md4>
                <div class="caption grey--text">Contact number</div>
                <div v-if="order.mobile" class="subtitle-1">{{ order.mobile }}</div>
              </v-flex>
              <v-flex v-if="order.customer_request">
                <v-textarea
                  prepend-icon="info"
                  label="Special Request"
                  v-model.trim="order.customer_request"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              color="primary"
              class="ma-2 white--text"
              :disabled="loading"
              :loading="loading"
              @click="orderLine"
            >
              LEARN MORE
              <v-icon right dark>arrow_forward_ios</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
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
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      search: null,
      order: {
        id: null,
        name: null,
        alternate_shipping_address: null,
        client_order_ref: null,
        contact_name: null,
        mobile: null,
        delivery_method: null,
        order_lines: null,
        sales_order_status: null,
        manufacturing_status_of_sales_order: null,
        customer_request: null
      },
      message: null,
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
  computed: {
    ...mapState(["userProfile", "error", "loading"])
  },
  methods: {
    searchOrder() {
      this.order.order_lines = null;
      this.$store.commit("setLoading", true);
      axios({
        method: "get",
        url:
          "http://api-test.sharpeye.co.nz/api/v1/model/sale.order/?domain=name,ilike," +
          this.search,
        headers: {
          access_token: this.userProfile.accessToken,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (
            res.data[0] &&
            this.userProfile.companyId == res.data[0].partner_id[0]
          ) {
            this.order.name = res.data[0].name;
            this.order.alternate_shipping_address =
              res.data[0].alternate_shipping_address;
            this.order.client_order_ref = res.data[0].client_order_ref;
            this.order.id = res.data[0].id;
            this.order.contact_name = res.data[0].contact_name;
            this.order.mobile = res.data[0].mobile;
            this.order.sales_order_status = res.data[0].sales_order_status;
            this.order.manufacturing_status_of_sales_order =
              res.data[0].manufacturing_status_of_sales_order;
            this.search = null;
            this.order.customer_request = res.data[0].customer_request;
          } else {
            this.message =
              "Oops, no result found. please make sure the order number is correct";
            this.$store.commit("setError", this.message);
            this.search = null;
          }
          this.$store.commit("setLoading", false);
        })
        .catch(err => {
          this.$store.commit("setLoading", false);
          this.$store.commit("setError", err.message);
        });
    },
    onDismissed() {
      this.$store.commit("clearError");
    },
    orderLine() {
      this.$store.commit("setLoading", true);
      axios({
        method: "get",
        url:
          "http://api-test.sharpeye.co.nz/api/v1/model/sale.order/" +
          this.order.id,
        headers: {
          access_token: this.userProfile.accessToken,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          this.$store.commit("setLoading", false);
          this.order.order_lines = res.data[0].order_line;
        })
        .catch(err => {
          this.$store.commit("setLoading", false);
          this.$store.commit("setError", err.message);
        });
    }
  }
};
</script>
