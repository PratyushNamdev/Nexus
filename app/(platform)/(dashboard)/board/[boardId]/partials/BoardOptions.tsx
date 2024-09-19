"use client";
import { Loader2, MoreHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { deleteBoard } from "@/actions/delete-board";
import { toast } from "sonner";
interface BoardOptionsProps {
  id: string;
}

export const BoardOptions = ({ id }: BoardOptionsProps) => {
  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => {
      toast.error(error);
    },
  });
  const onDeleteBoard = () => {
    execute({ id });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"transparent"} className="h-auto w-auto p-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="px-0 pt-3 pb-3"
        side={"bottom"}
        align={"start"}
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board Actions
        </div>
        <PopoverClose>
          <Button
            variant={"ghost"}
            className="h-auto w-auto absolute top-2 right-2 text-neutral-600 p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant={"ghost"}
          onClick={onDeleteBoard}
          disabled={isLoading}
          className="w-full rounded-none h-auto p-2 px-5 justify-start text-sm font-normal"
        >
          Delete this board
          {isLoading && (
            <div className="transition ml-auto">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </Button>
      </PopoverContent>
    </Popover>
  );
};
