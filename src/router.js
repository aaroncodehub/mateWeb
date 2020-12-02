import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'

import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import Settings from '@/components/Settings'
import AddUser from '@/components/AddUser'
import CreateOrder from '@/components/CreateOrder'
import EditOrder from '@/components/EditOrder'
import Message from '@/components/Message'
import OrderCompleted from '@/components/OrderCompleted'
import OrderOngoing from '@/components/OrderOngoing'
import Search from '@/components/Search'
import Help from '@/components/Help';
import Feedback from '@/components/Feedback';
import Download from '@/components/Download'
import CreateOrderByExcel from '@/components/CreateOrderByExcel'
import AddCustomer from '@/components/AddCustomer'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		{
			path: '*',
			redirect: '/dashboard'
		},
		{
			path: '/login',
			name: 'Login',
			component: Login
		},
		{
			path: '/addUser',
			name: 'AddUser',
			component: AddUser,
            meta: {
                requiresAuth: true
            }
		},
		{
			path: '/createOrder',
			name: 'CreateOrder',
			component: CreateOrder,
            meta: {
                requiresAuth: true
            }
		},
		{
			path: '/createOrderByExcel',
			name: 'CreateOrderByExcel',
			component: CreateOrderByExcel,
            meta: {
                requiresAuth: true
            }
		},
		{
			path: '/orderCompleted',
			name: 'OrderCompleted',
			component: OrderCompleted,
			props: true,
            meta: {
                requiresAuth: true
            }
		},
		{
			path: '/orderOngoing',
			name: 'OrderOngoing',
			component: OrderOngoing,
			props: true,
            meta: {
                requiresAuth: true
            }
		},
		{
			path: '/editOrder',
			name: 'EditOrder',
			component: EditOrder,
			props: true,
            meta: {
                requiresAuth: true
            }
		},
		{
			path: '/message',
			name: 'Message',
			component: Message,
			props: true,
            meta: {
                requiresAuth: true
            }
		},
		{
			path: '/help',
			name: 'Help',
			component: Help,
			props: true,
            meta: {
                requiresAuth: true
            }
		},
		{
			path: '/feedback',
			name: 'Feedback',
			component: Feedback,
			props: true,
            meta: {
                requiresAuth: true
            }
		},
		{
			path: '/download',
			name: 'Download',
			component: Download,
			props: true,
            meta: {
                requiresAuth: true
            }
		},
        {
			path: '/dashboard',
			name: 'Dashboard',
			component: Dashboard,
            meta: {
                requiresAuth: true
            }
		},
		{
			path: '/search',
			name: 'Search',
			component: Search,
            meta: {
                requiresAuth: true
            }
		},
		{
			path: '/addCustomer',
			name: 'AddCustomer',
			component: AddCustomer,
            meta: {
                requiresAuth: true
            }
		},
        {
			path: '/settings',
			name: 'Settings',
			component: Settings,
            meta: {
                requiresAuth: true
            }
		}
	]
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
    const currentUser = firebase.auth().currentUser

    if (requiresAuth && !currentUser) {
        next('/login')
    } else if (requiresAuth && currentUser) {
        next()
    } else {
        next()
    }
})

export default router
