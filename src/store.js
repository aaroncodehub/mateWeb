import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const fb = require('./fb')


Vue.use(Vuex)

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user)
    store.dispatch('fetchUserProfile')
  }
})

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    orders: [],
    error: null,
    loading: false,
  },
  mutations: {
    setCurrentUser(state, payload) {
      state.currentUser = payload
    },
    setUserProfile(state, payload) {
      state.userProfile = payload
    },
    setOrders(state, payload) {
      if (payload) {
        state.orders = payload
      } else {
        state.orders = []
      }
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    },
    deleteOrders(state, payload) {
      state.orders = payload
    },
    updateOrder(state, payload) {
      const updatedOrder = {
        ...state.orders.find(el => el.id == payload.id),
        alternate_shipping_address: payload.alternate_shipping_address,
        client_order_ref: payload.client_order_ref,
        contact_name: payload.contact_name,
        mobile: payload.mobile,
        delivery_method: payload.delivery_method
      }
      let foundIndex = state.orders.findIndex(x => x.id == payload.id)
      state.orders[foundIndex] = updatedOrder
    },
    deleteOrderLine(state, payload) {
      const orderOfDeletedLine = state.orders.find(el => el.id == payload.orderId)
      const index = orderOfDeletedLine.order_line.findIndex(line => line.id == payload.lineId)
      orderOfDeletedLine.order_line.splice(index, 1)
    },
    // updateOrderLine(state, payload){
    //   console.log(payload)
    // }
  },
  actions: {
    clearData({
      commit
    }) {
      commit('setCurrentUser', null)
      commit('setUserProfile', {})
      commit('setOrders', null)
      commit('clearError')
    },
    fetchUserProfile({
      commit,
      state
    }) {
      commit("setLoading", true)
      fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
        commit('setUserProfile', res.data())
        const companyId = res.data().companyId
        const accessToken = res.data().accessToken
        const limited = res.data().limitedOrder
        axios({
          method: 'get',
          url: 'https://api.sharpeye.co.nz/api/v1/model/sale.order/?limit=' + limited + '&detailed=True&domain=partner_id,=,' + companyId,
          headers: {
            'access_token': accessToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }).then(res => {
          commit('setOrders', res.data)
          commit("setLoading", false)
        })
          .catch(err => {
            commit("setLoading", false)
            commit('setError', err.message)
          })
      })
        .catch(err => {
          commit("setLoading", false)
          commit('setError', err.message)
        })
    },
    deleteOrder({
      commit,
      state
    }, payload) {
      if (payload) {
        const newOrders = state.orders.filter(order => order.id !== payload)
        commit('deleteOrders', newOrders)
      }
    }
  }
})

export default store