"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateListOrder } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = auth();

  if (!orgId || !userId) {
    return {
      error: "UnAuthorized",
    };
  }

  const { items, boardId } = data;

  let lists;
  if (orgId) {
    try {
      const transaction = items.map((list) =>
        prisma.list.update({
          where: {
            id: list.id,
            board: {
              orgId,
            },
          },
          data: {
            order: list.order,
          },
        })
      );
      lists = await prisma.$transaction(transaction);
    } catch (e) {
      console.log(e);
      return {
        error: "Failed to reorder",
      };
    }

    revalidatePath(`/board/${boardId}`);
    return {
      data: lists,
    };
  } else {
    return {
      error: "Something went wrong",
    };
  }
};
export const updateListOrder = createSafeAction(UpdateListOrder, handler);
