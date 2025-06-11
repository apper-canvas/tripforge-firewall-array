import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import Layout from './Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PlanTrip from './pages/PlanTrip';
import Explore from './pages/Explore';
import Budget from './pages/Budget';
import Bookings from './pages/Bookings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen overflow-hidden bg-white">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="plan-trip" element={<PlanTrip />} />
              <Route path="explore" element={<Explore />} />
              <Route path="budget" element={<Budget />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AnimatePresence>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;