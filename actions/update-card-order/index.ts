"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCardOrder } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = auth();

  if (!orgId || !userId) {
    return {
      error: "UnAuthorized",
    };
  }

  const { items, boardId } = data;

  let updatedCards;
  if (orgId) {
    try {
      const transaction = items.map((card) =>
        prisma.card.update({
          where: {
            id: card.id,
            list: {
              board: {
                orgId,
              },
            },
          },
          data: {
            order: card.order,
            listId: card.listId,
          },
        })
      );
      updatedCards = await prisma.$transaction(transaction);
    } catch (e) {
      console.log(e);
      return {
        error: "Failed to reorder",
      };
    }

    revalidatePath(`/board/${boardId}`);
    return {
      data: updatedCards,
    };
  } else {
    return {
      error: "Something went wrong",
    };
  }
};
export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);
