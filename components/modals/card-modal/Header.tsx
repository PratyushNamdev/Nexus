"use client";

import { updateCard } from "@/actions/update-card";
import { FormInput } from "@/components/form/FormInput";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "sonner";

interface HeaderProps {
  data: CardWithList;
}
export const Header = ({ data }: HeaderProps) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const inputRef = useRef<ElementRef<"input">>(null);
  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["card-logs", data.id],
      });
      toast.success(`Renamed card to ${data.title}`);
      setTitle(data.title);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const [title, setTitle] = useState(data.title);

  const handleSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = params.boardId as string;

    if (title === data.title) {
      return;
    }

    execute({ id: data.id, title, boardId });
  };
  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="h-5 w-5 mt-1 text-neutral-700" />
      <div className="w-full">
        <form action={handleSubmit}>
          <FormInput
            id="title"
            defaultValue={title}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
            ref={inputRef}
            onBlur={onBlur}
          />
        </form>
        <p className="text-sm text-muted-foreground ">
          in list <span className="underline">{data.list.title}</span>
        </p>
      </div>
    </div>
  );
};

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 mt-1" />
      <div>
        <Skeleton className="h-6 w-24 mb-1" />
        <Skeleton className="h-4 w-12 " />
      </div>
    </div>
  );
};
