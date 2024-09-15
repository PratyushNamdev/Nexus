import { Footer } from "./partials/Footer";
import { Navbar } from "./partials/Navbar";
const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-slate-100">
      <Navbar />
      <main className="pt-40 pb-20 md:py-40 bg-slate-100">{children}</main>
      <Footer/>
    </div>
  );
};
export default MarketingLayout;
