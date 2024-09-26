"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteList } from "./schema";

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
      list = await prisma.list.delete({
        where: {
          id,
          boardId,
          board: {
            orgId,
          },
        },
      });
    } catch (e) {
      console.log(e);
      return {
        error: "Cannot Delete List",
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
export const deleteList = createSafeAction(DeleteList, handler);
