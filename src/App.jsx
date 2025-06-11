import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AnimatePresence } from 'framer-motion'
import Layout from './Layout'
import { HomePage, DashboardPage, PlanTripPage, ExplorePage, BudgetPage, BookingsPage, DestinationDetailsPage, NotFoundPage } from '@/components/pages'
import 'react-toastify/dist/ReactToastify.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">An unexpected error occurred. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="App">
          <AnimatePresence>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="plan-trip" element={<PlanTripPage />} />
                <Route path="explore" element={<ExplorePage />} />
                <Route path="destination/:id" element={<DestinationDetailsPage />} />
                <Route path="budget" element={<BudgetPage />} />
                <Route path="bookings" element={<BookingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </AnimatePresence>
          <ToastContainer 
            position="top-right"
            autoClose={5000}
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
    </ErrorBoundary>
  );
}

export default App;