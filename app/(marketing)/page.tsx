import { Medal } from "lucide-react";
import Link from "next/link";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const headingFont = localFont({
  src: "../../public/fonts/CalSans-SemiBold.woff",
});

const MarketingPage = () => {
  return (
    <div className="flex justify-center items-center flex-col px-2">
      <div
        className={cn(
          "flex justify-center items-center flex-col",
          headingFont.className
        )}
      >
        <div className="mb-4 flex gap-2 bg-amber-100 text-amber-700 p-4 rounded-full uppercase">
          <Medal className="h-6 w-6 mr-2" />
          <span>No. 1 task management</span>
        </div>
        <h1 className="text-2xl md:text-6xl text-neutral-700 mb-4">
          Nexus helps team move
        </h1>
        <div className="text-3xl md:text-6xl bg-gradient-to-r text-slate-100 from-fuchsia-600 to-pink-600 px-4 py-2 rounded-md w-fit">
          work forward
        </div>
      </div>
      <div className="text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto">
        Collabrate, manage projects, and reach new productivity peaks. From high
        rises to home office, the way your team works is unique - accomplish it
        all with Nexus.
      </div>
      <Button className="mt-6" size={"lg"} asChild>
        <Link href={"/sign-up"}>Get Nexus for free</Link>
      </Button>
    </div>
  );
};
export default MarketingPage;
