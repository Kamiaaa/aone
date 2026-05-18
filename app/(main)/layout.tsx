import DarkModeToggle from "./components/DarkModeToggle";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>

      <main className="min-h-screen flex flex-col bg-zinc-50 font-sans dark:bg-black">
        <Header />
        <Navbar />
        {children}
        <DarkModeToggle />
        <ScrollToTop />
        <Footer />
      </main>

    </>
  );
}