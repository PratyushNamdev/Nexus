"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateList } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = auth();

  if (!orgId || !userId) {
    return {
      error: "UnAuthorized",
    };
  }

  const { title, boardId } = data;

  let list;
  if (orgId) {
    try {
      const board = await prisma.board.findUnique({
        where: {
          id: boardId,
          orgId,
        },
      });

      if (!board) {
        return {
          error: "Board not found",
        };
      }

      const lastList = await prisma.list.findFirst({
        where: {
          boardId,
        },
        orderBy: {
          order: "desc",
        },
        select: {
          order: true,
        },
      });

      const newOrder = lastList ? lastList.order + 1 : 1;

      list = await prisma.list.create({
        data: {
          title,
          boardId,
          order: newOrder,
        },
      });
    } catch (e) {
      console.log(e);
      return {
        error: "Cannot create List",
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
export const createList = createSafeAction(CreateList, handler);
