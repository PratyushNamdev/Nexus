"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyList } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = auth();

  if (!orgId || !userId) {
    return {
      error: "UnAuthorized",
    };
  }

  const { id, boardId } = data;
  let list;
  if (orgId) {
    try {
      const listToCopy = await prisma.list.findUnique({
        where: {
          id,
          boardId,
          board: {
            orgId,
          },
        },
        include: {
          cards: true,
        },
      });
      if (!listToCopy) {
        return {
          error: "List not found",
        };
      }
      const lastList = await prisma.list.findFirst({
        where: {
          boardId,
        },
        orderBy: {
          order: "desc",
        },
        select: { order: true },
      });

      const newOrder = lastList ? lastList.order + 1 : 1;
      list = await prisma.list.create({
        data: {
          boardId: listToCopy.boardId,
          title: `${listToCopy.title} - Copy`,
          order: newOrder,
          cards: {
            createMany: {
              data: listToCopy.cards.map((card) => {
                return {
                  title: card.title,
                  description: card.description,
                  order: card.order,
                };
              }),
            },
          },
        },
        include: {
          cards: true,
        },
      });
    } catch (e) {
      console.log(e);
      return {
        error: "Cannot Copy List",
      };
    }

    revalidatePath(`/board/${boardId}`);
    return {
      data: list,
    };
  } else {
    return {
      error: "Something went wrong",
    };
  }
};
export const copyList = createSafeAction(CopyList, handler);
