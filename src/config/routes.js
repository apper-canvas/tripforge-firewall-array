import { HomePage, DashboardPage, PlanTripPage, ExplorePage, BudgetPage, BookingsPage, DestinationDetailsPage } from '@/components/pages';

export const routes = {
  home: {
    id: 'home',
    label: 'Dashboard',
    path: '/',
    icon: 'Home',
    component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'My Trips',
    path: '/dashboard',
    icon: 'Map',
    component: DashboardPage
  },
  planTrip: {
    id: 'planTrip',
    label: 'Plan Trip',
    path: '/plan-trip',
    icon: 'Plus',
    component: PlanTripPage
  },
  explore: {
    id: 'explore',
    label: 'Explore',
    path: '/explore',
    icon: 'Compass',
    component: ExplorePage
  },
  budget: {
    id: 'budget',
    label: 'Budget',
    path: '/budget',
    icon: 'DollarSign',
    component: BudgetPage
  },
  bookings: {
    id: 'bookings',
    label: 'Bookings',
    path: '/bookings',
    icon: 'Calendar',
    component: BookingsPage
  },
  destinationDetails: {
    id: 'destinationDetails',
    label: 'Destination Details',
    path: '/destination/:id',
    icon: 'MapPin',
    component: DestinationDetailsPage
  }
};

export const routeArray = Object.values(routes);