import { Sidebar } from "../partials/Sidebar";

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="pt-20 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto">
      <div className="flex gap-x-7">
        <div className="w-64 shrink-0 hidden md:block bg-red-300">
            <Sidebar/>
        </div>
        {children}
      </div>
    </main>
  );
};
export default OrganizationLayout;
