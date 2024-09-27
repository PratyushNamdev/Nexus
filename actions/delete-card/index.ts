"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteCard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = auth();

  if (!orgId || !userId) {
    return {
      error: "UnAuthorized",
    };
  }

  const { id, boardId } = data;
  let card;
  if (orgId) {
    try {
      card = await prisma.card.delete({
        where: {
          id,
          list: {
            board: {
              orgId,
            },
          },
        },
      });
      await createAuditLog({
        entityTitle: card.title,
        entityId: card.id,
        entityType: ENTITY_TYPE.CARD,
        action: ACTION.DELETE,
      });
    } catch (e) {
      console.log(e);
      return {
        error: "Failed to delete",
      };
    }

    revalidatePath(`/board/${boardId}`);
    return {
      data: card,
    };
  } else {
    return {
      error: "Something went wrong",
    };
  }
};
export const deleteCard = createSafeAction(DeleteCard, handler);
