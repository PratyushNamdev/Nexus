import { useRef, ElementRef, KeyboardEventHandler, forwardRef } from "react";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";

import { createCard } from "@/actions/create-card";
import { FormTextarea } from "@/components/form/FormTextarea";
import { FormSubmit } from "@/components/form/SubmitForm";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { toast } from "sonner";

interface CardFormProps {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, isEditing, enableEditing, disableEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);
    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        toast.success(`Created card: ${data.title}`);
        formRef.current?.reset();
      },
      onError: (error) => {
        toast.error(`Failed to create card: ${error}`);
      },
    });
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };
    useOnClickOutside(formRef, disableEditing);
    useEventListener("keydown", onKeyDown);

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const handleSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const boardId = formData.get("boardId") as string;
      console.log({ title, listId, boardId });
      execute({ title, listId, boardId });
    };
    if (isEditing) {
      return (
        <form
          action={handleSubmit}
          ref={formRef}
          className="m-1 py-0.5 px-1 space-y-4 "
        >
          <FormTextarea
            id={"title"}
            ref={ref}
            placeholder={"Enter title for card"}
            onKeyDown={onTextareaKeyDown}
            errors={fieldErrors}
          />
          <input hidden id={"listId"} name={"listId"} value={listId} />
          <input
            hidden
            id={"boardId"}
            name={"boardId"}
            value={params.boardId}
          />
          <div className="flex items-center gap-x-1">
            <FormSubmit className="w-full">Add Card</FormSubmit>
            <Button onClick={disableEditing} size={"sm"} variant={"ghost"}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      );
    }
    return (
      <div className="pt-2 px-2">
        <Button
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start"
          size={"sm"}
          variant={"ghost"}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";
