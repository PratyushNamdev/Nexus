import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { MobileSidebar } from "./MobileSidebar";
import { FormPopover } from "@/components/form/FormPopover";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 px-4 z-50 w-full h-14 border-b shadow-sm bg-white flex items-center">
      <MobileSidebar />
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <FormPopover sideOffset={10} side={"right"}>
          <Button
            size={"sm"}
            variant={"primary"}
            className="rounded-sm h-auto py-1.5 px-2 md:px-2.5 md:py-2 block"
          >
            <span className="hidden md:block">Create</span>
            <span className="block md:hidden">
              <Plus className="h-4 w-4" />
            </span>
          </Button>
        </FormPopover>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl={"/organization/:id"}
          afterLeaveOrganizationUrl={"/select-org"}
          afterSelectOrganizationUrl={"/organization/:id"}
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            },
          }}
        />
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30,
              },
            },
          }}
        />
      </div>
    </nav>
  );
};
