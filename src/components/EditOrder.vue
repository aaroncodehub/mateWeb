<template>
  <v-container fluid>
    <v-layout row align-center justify-center class="mx-1">
      <v-flex xs12>
        <v-alert
          v-if="error"
          border="top"
          colored-border
          type="error"
          elevation="2"
        >{{ error }} . Oops. something went wrong , please try again later.</v-alert>

        <v-stepper v-model="step" vertical>
          <v-stepper-step :complete="step > 1" step="1" editable>
            Update sales order -- {{ order.name }}
            <small>sales order information</small>
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-card flat color="grey lighten-5" class="mb-6 px-2">
              <v-layout wrap>
                <v-flex xs12 md6>
                  <v-text-field
                    v-if="order.alternate_shipping_address"
                    prepend-icon="location_on"
                    label="Shipping Address"
                    v-model.trim="order.alternate_shipping_address"
                  ></v-text-field>
                  <v-text-field
                    v-else
                    prepend-icon="location_on"
                    label="Shipping Address"
                    v-model.trim="alternate_shipping_address"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 md6>
                  <v-text-field
                    v-if="order.client_order_ref"
                    prepend-icon="description"
                    label="Reference/Description"
                    v-model.trim="order.client_order_ref"
                  ></v-text-field>
                  <v-text-field
                    v-else
                    prepend-icon="description"
                    label="Reference/Description"
                    v-model.trim="client_order_ref"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 md4>
                  <v-text-field
                    v-if="order.contact_name"
                    prepend-icon="contacts"
                    label="Contact Name"
                    v-model.trim="order.contact_name"
                  ></v-text-field>
                  <v-text-field
                    v-else
                    prepend-icon="contacts"
                    label="Contact Name"
                    v-model.trim="contact_name"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 md4>
                  <v-text-field
                    v-if="order.mobile"
                    prepend-icon="phone"
                    label="Contact Phone"
                    v-model.trim="order.mobile"
                  ></v-text-field>
                  <v-text-field
                    v-else
                    prepend-icon="phone"
                    label="Contact Phone"
                    v-model.trim="mobile"
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

                <v-flex>
                  <v-textarea
                    v-if="order.customer_request"
                    prepend-icon="info"
                    label="Special Request"
                    v-model.trim="order.customer_request"
                  ></v-textarea>
                  <v-textarea
                    v-else
                    prepend-icon="info"
                    label="Special Request"
                    v-model.trim="customer_request"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-card>
            <v-btn
              :disabled="loading"
              :loading="loading"
              color="primary"
              @click="updateOrderInfo"
            >Update</v-btn>
            <v-btn class="ml-2" color="primary" @click="step = 2">continue</v-btn>
            <v-btn text :to="{ name: 'Dashboard' }">Cancel</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="step > 2" step="2">Update sales order lines</v-stepper-step>
          <v-stepper-content step="2">
            <v-card flat color="grey lighten-5" class="mb-6 px-2">
              <v-layout wrap v-for="(orderLine, index) in order.order_line" v-bind:key="index">
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
                  <v-flex xs12 md2>
                    <v-select
                      v-model="orderLine.product_id[0]"
                      :items="products"
                      item-text="product"
                      item-value="value"
                      label="Glass type"
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
                  <v-flex xs12 md2>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          small
                          text
                          @click="
                            updateOrderLine(
                              orderLine.id,
                              orderLine.product_id[0],
                              orderLine.width,
                              orderLine.height,
                              orderLine.number_of_pieces,
                              orderLine.ynt_selection
                            )
                          "
                          v-on="on"
                          icon
                        >
                          <v-icon>update</v-icon>
                        </v-btn>
                      </template>
                      <span>Update Order Line</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn small text @click="deleteOrderLine(orderLine.id)" v-on="on" icon>
                          <v-icon>delete_forever</v-icon>
                        </v-btn>
                      </template>
                      <span>Delete Order Line</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-layout>
            </v-card>
            <v-btn color="primary" :to="{ name: 'Dashboard' }">close</v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-flex>
    </v-layout>
    <v-snackbar color="success" v-model="snackbar.snackbar" :timeout="snackbar.timeout">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  data() {
    return {
      step: 1,
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
      deliver: ["pick_up", "deliver", "freight"],
      snackbar: {
        snackbar: false,
        text: null,
        timeout: 2000
      },
      client_order_ref: "",
      alternate_shipping_address: "",
      contact_name: "",
      mobile: "",
      customer_request: ""
    };
  },
  props: ["order"],
  computed: {
    ...mapState(["userProfile", "error", "loading"])
  },
  methods: {
    updateOrderInfo() {
      this.$store.commit("setLoading", true);
      if (this.order.client_order_ref) {
        this.client_order_ref = this.order.client_order_ref;
      }
      if (this.order.alternate_shipping_address) {
        this.alternate_shipping_address = this.order.alternate_shipping_address;
      }
      if (this.order.contact_name) {
        this.contact_name = this.order.contact_name;
      }
      if (this.order.mobile) {
        this.mobile = this.order.mobile;
      }
      if (this.order.customer_request) {
        this.customer_request = this.order.customer_request;
      }

      axios({
        method: "PUT",
        url:
          "https://api.sharpeye.co.nz/api/v1/model/sale.order/" + this.order.id,
        headers: {
          access_token: this.userProfile.accessToken,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        data: {
          alternate_shipping_address: this.alternate_shipping_address,
          client_order_ref: this.client_order_ref,
          contact_name: this.contact_name,
          mobile: this.mobile,
          delivery_method: this.order.delivery_method,
          customer_request: this.customer_request
        }
      })
        .then(() => {
          this.$store.commit("setLoading", false);
          this.$store.commit("updateOrder", {
            id: this.order.id,
            alternate_shipping_address: this.alternate_shipping_address,
            client_order_ref: this.client_order_ref,
            contact_name: this.contact_name,
            mobile: this.mobile,
            delivery_method: this.order.delivery_method,
            customer_request: this.customer_request
          });
          this.step = 2;
          this.snackbar.text = " update sales order information successfully ";
          this.snackbar.snackbar = true;
        })
        .catch(err => {
          this.$store.commit("setLoading", false);
          this.$store.commit("setError", err.message);
          // console.log(err);
        });
    },
    updateOrderLine(id, product, width, height, pieces, ynt) {
      this.$store.commit("setLoading", true);
      axios({
        method: "PUT",
        url: "https://api.sharpeye.co.nz/api/v1/model/sale.order.line/" + id,
        headers: {
          access_token: this.userProfile.accessToken,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        data: {
          product_id: product,
          width: width,
          height: height,
          number_of_pieces: pieces,
          ynt_selection: ynt
        }
      })
        .then(() => {
          this.$store.commit("setLoading", false);
          // this.$store.commit('updateOrderLine',{
          // lineId: id,
          // orderId: this.order.id,
          // product_id: product,
          // width: width,
          // height: height,
          // number_of_pieces: pieces,
          // ynt_selection: ynt
          // })
          this.snackbar.text = " update sales order line successfully ";
          this.snackbar.snackbar = true;
        })
        .catch(err => {
          this.$store.commit("setLoading", false);
          this.$store.commit("setError", err.message);
          // console.log(err);
        });
    },
    deleteOrderLine(id) {
      this.$store.commit("setLoading", true);
      axios({
        method: "DELETE",
        url: "https://api.sharpeye.co.nz/api/v1/model/sale.order.line/" + id,
        headers: {
          access_token: this.userProfile.accessToken
        }
      })
        .then(() => {
          this.$store.commit("setLoading", false);
          this.$store.commit("deleteOrderLine", {
            lineId: id,
            orderId: this.order.id
          });
          this.snackbar.text = " delete sales order line successfully ";
          this.snackbar.snackbar = true;
        })
        .catch(err => {
          this.$store.commit("setLoading", false);
          this.$store.commit("setError", err.message);
          // console.log(err);
        });
    }
  }
};
</script>
