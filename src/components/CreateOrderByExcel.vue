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
                  <v-flex xs12>
                    <v-toolbar dark color="teal">
                      <v-btn icon>
                        <v-icon>business</v-icon>
                      </v-btn>
                      <v-toolbar-title>Customer</v-toolbar-title>
                      <v-autocomplete
                        v-model="partner_id"
                        :loading="searchLoading"
                        :items="customers"
                        :search-input.sync="searchCustomer"
                        item-text="name"
                        item-value="partner_id"
                        @change="selectChange(partner_id)"
                        cache-items
                        class="mx-4"
                        flat
                        hide-no-data
                        hide-details
                        label="type or select the customer"
                        solo-inverted
                      ></v-autocomplete>
                      <v-btn icon>
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </v-toolbar>
                  </v-flex>
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
              <small>add order lines by importing excel template</small>
            </v-stepper-step>

            <v-stepper-content step="2">
              <UploadExcelComponent :on-success="handleSuccess" :before-upload="beforeUpload" />
              <v-card flat color="grey lighten-5" class="mb-6 px-2">
                <v-card-title>
                  Your order lines
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-card-title>
                <v-data-table :headers="headers" :items="tableData" :search="search"></v-data-table>
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
import UploadExcelComponent from "./UploadExcel";
import axios from "axios";
const fb = require("../fb");
export default {
  name: "Navbar",
  components: { UploadExcelComponent },
  data() {
    return {
      snackbar: {
        snackbar: false,
        text: null,
        timeout: 2000
      },
      step: 1,
      editable: true,
      salesOrder: {
        shippingAddress: "",
        clientRef: "",
        contactName: "",
        contactPhone: "",
        deliver: "",
        customer_request: ""
      },
      deliver: ["pick_up", "deliver", "freight"],
      partner_id: null,
      salesperson_id: null,
      customers: [],
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
      file: null,

      tableData: [],
      tableHeader: [],
      search: "",
      searchCustomer: "",
      searchLoading: false,
      headers: [
        {
          text: "Sequence",
          value: "sequence"
        },
        {
          text: "Product Code",
          value: "product_id"
        },
        {
          text: "Description",
          value: "name"
        },

        {
          text: "Order Sequence",
          value: "order_sequence"
        },
        {
          text: "Quantity",
          value: "product_uom_qty"
        },
        {
          text: "Unit Price",
          value: "price_unit"
        },
        {
          text: "Width",
          value: "width"
        },
        {
          text: "Height",
          value: "height"
        },
        {
          text: "PCs",
          value: "number_of_pieces"
        },
        {
          text: "Flag",
          value: "ynt_selection"
        }
      ]
    };
  },
  computed: {
    ...mapState(["userProfile", "loading", "error"])
  },
  methods: {
    createOrder() {
      // allow to create sales order without sale line
      // this.orderLines = this.orderLines.filter(
      //   (line) => line.product_id != null
      // );

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
          partner_id: this.partner_id,
          over_credit_confirmed: this.userProfile.overCreditConfirmed,
          alternate_shipping_address: this.salesOrder.shippingAddress,
          client_order_ref: this.salesOrder.clientRef,
          customer_request: this.salesOrder.customer_request,
          contact_name: this.salesOrder.contactName,
          mobile: this.salesOrder.contactPhone,
          delivery_method: this.salesOrder.deliver,
          created_by: this.userProfile.userId,
          order_line: this.tableData
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
            if (!this.partner_id) {
              this.$store.commit("setLoading", false);
              this.$store.commit("setError", " please select a customer");
            } else {
              this.$store.commit("setLoading", false);
              this.$store.commit(
                "setError",
                " please correct the data and drop the excel template again. make sure the product code is correct"
              );
            }
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
    },

    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (isLt1M) {
        return true;
      }
      this.$store.commit(
        "setError",
        " Sorry, Please do not upload files larger than 1m in size. , thank you"
      );

      return false;
    },
    handleSuccess({ results, header }) {
      this.tableData = results;
      this.tableHeader = header;
      results.map(line => {
        switch (line.product_id) {
          case "LMG-4MM":
            line.product_id = 2380;
            break;
          case "LMG-5MM":
            line.product_id = 22;
            break;
          case "LMG-5MM-LOW-IRON":
            line.product_id = 23;
            break;
          case "LMG-5MM-SILVER-MIRRO":
            line.product_id = 24;
            break;
          case "LMG-6MM":
            line.product_id = 25;
            break;
          case "LMG-6MM-SILVER-MIRRO":
            line.product_id = 2522;
            break;
          case "LMG-6.38MM-LAMINATED":
            line.product_id = 2303;
            break;
          case "LMG-8MM":
            line.product_id = 26;
            break;
          case "LMG-10MM":
            line.product_id = 27;
            break;
          case "LMG-12MM":
            line.product_id = 28;
            break;
          case "LMG-12MM-EUROGREY":
            line.product_id = 29;
            break;
          case "LMG-12MM-GREEN":
            line.product_id = 2083;
            break;
          case "LMG-12MM-ULTRA-CLEAR":
            line.product_id = 2529;
            break;
          case "LMG-15MM":
            line.product_id = 30;
            break;
          case "LMG-15MM-ULTRA-CLEAR":
            line.product_id = 2530;
            break;
          case "FI":
            line.product_id = 3;
            break;
          case "FP":
            line.product_id = 2631;
            break;
          case "HP":
            line.product_id = 5;
            break;
          case "HO":
            line.product_id = 2;
            break;
          case "PA":
            line.product_id = 11;
            break;
          case "SA":
            line.product_id = 8;
            break;
          case "TO":
            line.product_id = 9;
            break;
          case "WA":
            line.product_id = 2629;
            break;
          case "DG":
            line.product_id = 2614;
            break;
          case "LA":
            line.product_id = 2613;
            break;
          case "M-AC":
            line.product_id = 1855;
            break;
          case "M-CC":
            line.product_id = 2101;
            break;
          case "M-CN":
            line.product_id = 1853;
            break;
          case "M-EL":
            line.product_id = 1856;
            break;
          case "M-MC":
            line.product_id = 2102;
            break;
          case "M-ME":
            line.product_id = 2095;
            break;
          case "M-RC":
            line.product_id = 1851;
            break;
          case "M-RP":
            line.product_id = 2559;
            break;
          default:
            return (line.product_id = "Oops! product does not exist.");
        }
      });
    },
    selectChange(partnerId) {
      const selectedCustomer = this.customers.filter(
        customer => customer.partner_id === partnerId
      );
      this.salesOrder.shippingAddress =
        selectedCustomer[0].alternate_shipping_address;
      this.salesOrder.contactName = selectedCustomer[0].contact_name;
      this.salesOrder.contactPhone = selectedCustomer[0].mobile;
    }
  },
  mounted() {
    var getCustomers = [];
    fb.customersCollection
      .get()
      .then(function(querySnapshot) {
        // querySnapshot.forEach(function(doc) {
        //   // doc.data() is never undefined for query doc snapshots
        //   // this.customers.push(doc.data());
        // });
        getCustomers = querySnapshot.docs.map(doc => doc.data());
      })
      .then(() => (this.customers = getCustomers));
  },
  destroyed() {
    this.$store.commit("clearError");
  },
    updated() {
    if (this.userProfile.rank < 2) {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch("clearData");
          this.$router.push("/login");
        })
        .catch((err) => {
          this.$store.commit("setLoading", false);
          this.$store.commit("setError", err.message);
        })
    }
  },
};
</script>
