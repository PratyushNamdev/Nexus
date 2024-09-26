"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateCard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = auth();

  if (!orgId || !userId) {
    return {
      error: "UnAuthorized",
    };
  }

  const { title, boardId, listId } = data;

  let card;
  if (orgId) {
    try {
      const list = await prisma.list.findUnique({
        where: {
          id: listId,
          boardId,
          board: {
            orgId,
          },
        },
      });
      if (!list) {
        return {
          error: "List not found",
        };
      }
      const lastCard = await prisma.card.findFirst({
        where: { listId },
        orderBy: {
          order: "desc",
        },
        select: { order: true },
      });
      const newOrder = lastCard? lastCard.order + 1 : 1;
      card = await prisma.card.create({
        data: {
          title,
          listId,
          order: newOrder,
        },
      })
    } catch (e) {
      console.log(e);
      return {
        error: "Cannot create card",
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
export const createCard = createSafeAction(CreateCard, handler);
