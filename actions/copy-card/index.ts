"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyCard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

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
      const cardToCopy = await prisma.card.findUnique({
        where: {
          id,
          list: {
            board: {
              orgId,
            },
          },
        },
      });
      if (!cardToCopy) {
        return {
          error: "Card not found",
        };
      }
      const lastCard = await prisma.card.findFirst({
        where: {
          listId: cardToCopy.listId,
        },
        orderBy: {
          order: "desc",
        },
        select: {
          order: true,
        },
      });

      const newOrder = lastCard ? lastCard.order + 1 : 1;
      card = await prisma.card.create({
        data: {
          title: `${cardToCopy.title}  - Copy`,
          description: cardToCopy.description,
          listId: cardToCopy.listId,
          order: newOrder,
        },
      });
      await createAuditLog({
        entityTitle: card.title,
        entityId: card.id,
        entityType: ENTITY_TYPE.CARD,
        action: ACTION.CREATE,
      });
    } catch (e) {
      console.log(e);
      return {
        error: "Cannot Copy card",
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
export const copyCard = createSafeAction(CopyCard, handler);
