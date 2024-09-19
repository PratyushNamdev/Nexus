"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import Image from "next/image";
export const Info = () => {
  const { organization, isLoaded } = useOrganization();
  if (!isLoaded) {
    return <Info.Skeleton />;
  }
  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[60px] h-[60px] relative">
        <Image
          fill
          src={
            organization?.imageUrl ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm372Z3eNKol2BfYtzeYeca090MRQuLlwrXS_8Gw6L8dBKmFJ7UCcAWnUC_ToqGc8vVR0&usqp=CAU"
          }
          alt="Organization"
          className="rounded-md object-cover"
        />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-xl ">{organization?.name}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <CreditCard className="h-3 w-3 mr-1" />
          Free
        </div>
      </div>
    </div>
  );
};

Info.Skeleton = function SkeletonInfo() {
  return (
    <div className="flex items-center gap-x-4">
      <div className="h-[60px] w-[60px] relative ">
        <Skeleton className="w-full h-full absolute bg-slate-200" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px] bg-slate-200" />
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 mr-2 bg-slate-200" />
          <Skeleton className="h-4 w-[100px] bg-slate-200" />
        </div>
      </div>
    </div>
  );
};
