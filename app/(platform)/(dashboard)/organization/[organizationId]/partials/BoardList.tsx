import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { FormPopover } from "@/components/form/FormPopover";
import { Hint } from "@/components/hint";
import { HelpCircle, User2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export const BoardList = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const boards = await prisma.board.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700 ">
        <User2 className="h-6 w-6 mr-2" />
        Your Boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link
            href={`/board/${board.id}`}
            key={board.id}
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm w-full h-full p-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}

        <FormPopover sideOffset={10} side={"right"}>
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-slate-100 rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-sm">Create new board</p>
            <span className="text-xs">5 Remaining</span>
            <Hint
              description={`Free Workspaces can have upto 5 open boards. For unlimited boards upgrade this workspace. `}
              sideOffset={30}
            >
              <HelpCircle className="absolute buttom-2 right-2 h-[14px] w-[14px]" />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
};

BoardList.Skeleton = function SkeletionBoardList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2"></Skeleton>
      <Skeleton className="aspect-video h-full w-full p-2"></Skeleton>
      <Skeleton className="aspect-video h-full w-full p-2"></Skeleton>
      <Skeleton className="aspect-video h-full w-full p-2"></Skeleton>
      <Skeleton className="aspect-video h-full w-full p-2"></Skeleton>
      <Skeleton className="aspect-video h-full w-full p-2"></Skeleton>
      <Skeleton className="aspect-video h-full w-full p-2"></Skeleton>
      <Skeleton className="aspect-video h-full w-full p-2"></Skeleton>
    </div>
  );
};
