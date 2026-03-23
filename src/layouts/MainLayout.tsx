import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import BackToTop from '../components/BackToTop';
import CustomCursor from '../components/CustomCursor';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-ivory">
      <ScrollToTop />
      <CustomCursor />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
