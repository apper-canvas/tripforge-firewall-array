import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import PlanTrip from '../pages/PlanTrip';
import Explore from '../pages/Explore';
import Budget from '../pages/Budget';
import Bookings from '../pages/Bookings';

export const routes = {
  home: {
    id: 'home',
    label: 'Dashboard',
    path: '/',
    icon: 'Home',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'My Trips',
    path: '/dashboard',
    icon: 'Map',
    component: Dashboard
  },
  planTrip: {
    id: 'planTrip',
    label: 'Plan Trip',
    path: '/plan-trip',
    icon: 'Plus',
    component: PlanTrip
  },
  explore: {
    id: 'explore',
    label: 'Explore',
    path: '/explore',
    icon: 'Compass',
    component: Explore
  },
  budget: {
    id: 'budget',
    label: 'Budget',
    path: '/budget',
    icon: 'DollarSign',
    component: Budget
  },
  bookings: {
    id: 'bookings',
    label: 'Bookings',
    path: '/bookings',
    icon: 'Calendar',
    component: Bookings
  }
};

export const routeArray = Object.values(routes);