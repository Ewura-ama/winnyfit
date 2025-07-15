import { lazy } from 'react';


const Landingpage = lazy(() => import('./pages/landingpage/LandingPage'))
const SignIn = lazy(() => import('./pages/accounts/SignIn'))
const SignUp = lazy(() => import('./pages/accounts/SignUp'))
const Profile = lazy(() => import('./pages/accounts/Profile'))
const Booking = lazy(() => import('./pages/booking/BookingPage'))
const routes = [
    { path: '/', component: Landingpage},
    { path: '/signin', component: SignIn},
    { path: '/signup', component: SignUp},
    { path: '/profile', component: Profile},
    { path: 'booking/', component: Booking}
]

export default routes;