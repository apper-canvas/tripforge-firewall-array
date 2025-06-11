import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import Layout from './Layout';
import { HomePage, DashboardPage, PlanTripPage, ExplorePage, BudgetPage, BookingsPage, NotFoundPage } from '@/components/pages';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen overflow-hidden bg-white">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Layout />}>
<Route index element={<HomePage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="plan-trip" element={<PlanTripPage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="budget" element={<BudgetPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
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