import { cn } from "@/lib/utils";
import Link from "next/link";

import localFont from "next/font/local";

const HeadingFont = localFont({
  src: "../public/fonts/CalSans-SemiBold.woff",
});
export const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <img src={"/logo2.svg"} alt={"Nexus Logo"} height={50} width={50} />
        <p
          className={cn("text-lg text-neutral-700 pb-1", HeadingFont.className)}
        >
          Nexus
        </p>
      </div>
    </Link>
  );
};
