<template>
  <v-container fluid>
    <v-layout row align-center justify-center class="mx-1">
      <form @submit.prevent="createOrder">
        <v-flex xs12>
          <myAlert v-if="error" @dismissed="onDismissed" :text="error"></myAlert>
          <v-alert
            v-if="message"
            border="top"
            colored-border
            type="error"
            elevation="2"
          >{{ message }}</v-alert>
          <v-stepper v-model="step" vertical>
            <v-stepper-step :complete="step > 1" step="1" :editable="editable">
              Create order
              <small>sales order information</small>
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-card flat color="grey lighten-5" class="mb-6 px-2">
                <v-layout wrap>
                  <v-flex xs12 md6>
                    <v-text-field
                      prepend-icon="location_on"
                      label="Shipping Address"
                      v-model.trim="salesOrder.shippingAddress"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field
                      prepend-icon="description"
                      label="Reference/Description"
                      v-model.trim="salesOrder.clientRef"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 md4>
                    <v-text-field
                      prepend-icon="contacts"
                      label="Contact Name"
                      v-model.trim="salesOrder.contactName"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-text-field
                      prepend-icon="phone"
                      label="Contact Phone"
                      v-model.trim="salesOrder.contactPhone"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-select
                      prepend-icon="local_shipping"
                      v-model="salesOrder.deliver"
                      :items="deliver"
                      label="Deliver Method"
                    ></v-select>
                  </v-flex>
                  <v-flex>
                    <v-textarea
                      prepend-icon="info"
                      label="Special Request"
                      v-model.trim="salesOrder.customer_request"
                    ></v-textarea>
                  </v-flex>
                </v-layout>
              </v-card>

              <v-btn color="primary" @click="step = 2">Continue</v-btn>
              <v-btn text :to="{ name: 'Dashboard' }">Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="step > 2" step="2" :editable="editable">
              Add sales order lines
              <small>
                Add glass details and the maximum is 50 PCs / sales
                order
              </small>
            </v-stepper-step>

            <v-stepper-content step="2">
              <v-card flat color="grey lighten-5" class="mb-6 px-2">
                <v-layout wrap v-for="(orderLine, index) in orderLines" v-bind:key="index">
                  <v-flex xs12 md2>
                    <v-select
                      v-model="orderLine.product_id"
                      :items="products"
                      item-text="product"
                      item-value="value"
                      label="Products"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 md2>
                    <v-text-field v-model.number="orderLine.width" label="Width" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12 md2>
                    <v-text-field v-model.number="orderLine.height" label="Height" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12 md2>
                    <v-text-field v-model.number="orderLine.number_of_pieces" label="PCs" clearable></v-text-field>
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
                        <v-btn small text @click="addOrderLine" v-on="on" icon>
                          <v-icon>playlist_add</v-icon>
                        </v-btn>
                      </template>
                      <span>Add Order Line</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn small text @click="deleteOrderLine(index)" v-on="on" icon>
                          <v-icon>delete_forever</v-icon>
                        </v-btn>
                      </template>
                      <span>Delete Order Line</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-card>
              <v-btn type="submit" :disabled="loading" :loading="loading" color="primary">Submit</v-btn>

              <v-btn text :to="{ name: 'Dashboard' }">Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="step > 3" step="3">
              Upload drawing & attachment
              <small>upload any attachment for your order</small>
            </v-stepper-step>

            <v-stepper-content step="3">
              <v-layout wrap>
                <v-flex xs12>
                  <v-file-input
                    :rules="rules"
                    placeholder="Select the drawing or attachment"
                    small-chips
                    label="Drawing"
                    type="file"
                    ref="drawing"
                    @change="fileEncode"
                  ></v-file-input>
                </v-flex>
              </v-layout>

              <v-btn :disabled="loading" :loading="loading" color="primary" @click="uploadFile">
                Upload Drawing
                <v-icon right dark>cloud_upload</v-icon>
              </v-btn>

              <v-btn text :to="{ name: 'Dashboard' }">NO Attachment</v-btn>
            </v-stepper-content>
          </v-stepper>
        </v-flex>
      </form>
    </v-layout>
    <v-snackbar color="success" v-model="snackbar.snackbar" :timeout="snackbar.timeout">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
export default {
  name: "Navbar",
  data() {
    return {
      snackbar: {
        snackbar: false,
        text: null,
        timeout: 2000
      },
      step: 1,
      editable: true,
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
      salesOrder: {
        shippingAddress: "",
        clientRef: "",
        contactName: "",
        contactPhone: "",
        deliver: "",
        customer_request: ""
      },
      deliver: ["pick_up", "deliver", "freight"],
      orderLines: [
        {
          product_id: null,
          order_sequence: 1,
          width: null,
          height: null,
          number_of_pieces: null,
          ynt_selection: null
        }
      ],
      orderId: null,
      orderName: null,
      rules: [
        value =>
          !value ||
          value.size < 20000000 ||
          "The attachment size should be less than 20 MB!"
      ],
      message: null,
      base64: null,
      file: null
    };
  },
  computed: {
    ...mapState(["userProfile", "loading", "error"])
  },
  methods: {
    addOrderLine() {
      this.orderLines.push({
        product_id: this.orderLines[this.orderLines.length - 1].product_id,
        order_sequence:
          this.orderLines[this.orderLines.length - 1].order_sequence + 1,
        width: this.orderLines[this.orderLines.length - 1].width,
        height: this.orderLines[this.orderLines.length - 1].height,
        number_of_pieces: this.orderLines[this.orderLines.length - 1]
          .number_of_pieces,
        ynt_selection: this.orderLines[this.orderLines.length - 1].ynt_selection
      });
    },
    deleteOrderLine(index) {
      if (index > 0) {
        this.orderLines.splice(index, 1);
      }
    },
    createOrder() {
      // allow to create sales order without sale line
      this.orderLines = this.orderLines.filter(line => line.product_id != null);
      this.$store.commit("setLoading", true);
      // please confirm the data type
      axios({
        method: "POST",
        url: "http://api-test.sharpeye.co.nz/api/v1/model/sale.order",
        headers: {
          access_token: this.userProfile.accessToken,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        data: {
          partner_id: this.userProfile.companyId,
          over_credit_confirmed: this.userProfile.overCreditConfirmed,
          user_id: this.userProfile.salesPerson,
          alternate_shipping_address: this.salesOrder.shippingAddress,
          client_order_ref: this.salesOrder.clientRef,
          customer_request: this.salesOrder.customer_request,
          contact_name: this.salesOrder.contactName,
          mobile: this.salesOrder.contactPhone,
          delivery_method: this.salesOrder.deliver,
          created_by: this.userProfile.userId,
          order_line: this.orderLines
        }
      })
        .then(res => {
          this.$store.commit("setLoading", false);
          if (res.data.id) {
            this.orderName = res.data.result.name;
            this.orderId = res.data.id;
            this.snackbar.text = " create sales order  successfully ";
            this.snackbar.snackbar = true;
            this.step = 3;
            this.editable = false;
          } else {
            this.$store.commit("setLoading", false);
            this.$store.commit(
              "setError",
              " Sorry, you have to populate with the Width, Height,PCs and Flag as required , thank you"
            );
          }
        })
        .then(() => {
          if (this.orderId) {
            let today = new Date();
            let date =
              today.getFullYear() +
              "-" +
              (today.getMonth() + 1) +
              "-" +
              today.getDate();
            let time =
              today.getHours() +
              ":" +
              today.getMinutes() +
              ":" +
              today.getSeconds();
            let dateTime = date + " " + time;
            axios({
              method: "POST",
              url:
                "https://us-central1-mysharpeyemate.cloudfunctions.net/sendMail",
              data: {
                email: this.userProfile.noticeEmail,
                bccEmail: this.userProfile.messageEmail,
                orderId: this.orderName,
                name: this.userProfile.name,
                date: dateTime,
                company: this.userProfile.company
              }
            });
            // .then((response) => {
            //     console.log(response.data);
            //   })
            // .catch((error) => {
            //   console.log(error);
            // })
          }
        })
        .catch(err => {
          this.$store.commit("setLoading", false);
          this.$store.commit("setError", err.message);
        });
    },
    fileEncode(file) {
      this.message = null;
      this.file = file;
      if (this.file && this.file.size < 20000000) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(this.file);
          reader.onload = () => {
            let encoded = reader.result.replace(/^data:(.*,)?/, "");
            if (encoded.length % 4 > 0) {
              encoded += "=".repeat(4 - (encoded.length % 4));
            }
            resolve(encoded);
            this.base64 = encoded;
          };
          reader.onerror = error => reject(error);
        });
      } else {
        this.message = this.file
          ? "The attachment is too large . the max size is 20M"
          : "";
      }
    },
    uploadFile() {
      if (this.base64) {
        let formData = {
          data: this.base64,
          name: this.orderName + " " + "Drawing" + " " + this.file.name
        };
        this.$store.commit("setLoading", true);
        axios({
          method: "POST",
          url:
            "http://api-test.sharpeye.co.nz/api/v1/model/sale.order/" +
            this.orderId +
            "/attachment",
          headers: {
            access_token: this.userProfile.accessToken,
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          data: {
            attachments: [formData]
          }
        })
          .then(() => {
            this.$store.commit("setLoading", false);
            this.snackbar = true;
            this.$router.push("/dashboard");
          })
          .catch(err => {
            this.$store.commit("setLoading", false);
            this.$store.commit("setError", err.message);
          });
      }
    },
    onDismissed() {
      this.$store.commit("clearError");
    }
  },
  created() {
    this.salesOrder.shippingAddress = this.userProfile.companyAddress;
    this.salesOrder.contactName = this.userProfile.name;
    this.salesOrder.contactPhone = this.userProfile.phone;
  },
  destroyed() {
    this.$store.commit("clearError");
  }
};
</script>
