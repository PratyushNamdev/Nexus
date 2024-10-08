import { ModalProvider } from "@/components/providers/ModalProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <Toaster />
      <ModalProvider />
      {children}
    </ClerkProvider>
  );
};
export default PlatformLayout;
