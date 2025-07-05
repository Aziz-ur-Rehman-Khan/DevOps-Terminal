import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen">
        <Navbar />
        <div className="pt-20">
        {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}