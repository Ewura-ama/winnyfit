import { lazy } from 'react';




const Landingpage = lazy(() => import('./pages/landingpage/LandingPage'))
const SignIn = lazy(() => import('./pages/accounts/SignIn'))
const SignUp = lazy(() => import('./pages/accounts/SignUp'))
const Profile = lazy(() => import('./pages/accounts/Profile'))
const Booking = lazy(() => import('./pages/booking/BookingPage'))

const Classes = lazy(() => import('./pages/classes/ClassesPage'))
const Trainers = lazy(() => import('./pages/trainers/TrainersPage'))
const Products = lazy(() => import('./pages/products/ProductsPage'))
const ProductDetail = lazy(() => import('./pages/products/ProductDetail'))
const Cart = lazy(() => import('./pages/cart/Cart'))
const Checkout = lazy(() => import('./pages/checkout/Checkout'))
const DashboardPage = lazy(() => import('./pages/dashboard/Dashboard'))
const SessionsPage = lazy(() => import('./pages/dashboard/Sessions'))
const routes = [
    { path: '/', component: Landingpage},
    { path: '/signin', component: SignIn},
    { path: '/signup', component: SignUp},
    { path: '/profile', component: Profile},
    { path: 'booking/', component: Booking},
    { path: 'classes/', component: Classes},
    { path: 'trainers/', component: Trainers},
    { path: 'products/', component: Products},
    { path: 'product/:productName', component: ProductDetail},
    { path: 'cart/', component: Cart},
    { path: 'checkout/', component: Checkout},
    { path: 'dashboard/', component: DashboardPage},
    { path: 'sessions/', component: SessionsPage}
]

export default routes;