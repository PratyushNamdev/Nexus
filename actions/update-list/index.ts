"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateList } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = auth();

  if (!orgId || !userId) {
    return {
      error: "UnAuthorized",
    };
  }

  const { title, id, boardId } = data;

  let list;
  if (orgId) {
    try {
      list = await prisma.list.update({
        where: {
          id,
          boardId,
          board: {
            orgId,
          },
        },
        data: {
          title,
        },
      });
    } catch (e) {
      console.log(e);
      return {
        error: "Cannot Update List",
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
export const updateList = createSafeAction(UpdateList, handler);
