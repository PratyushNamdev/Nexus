"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = auth();

  if (!orgId || !userId) {
    return {
      error: "UnAuthorized",
    };
  }

  const { title, id } = data;

  let board;
  if (orgId) {
    try {
      board = await prisma.board.update({
        where: {
          id,
          orgId,
        },
        data: {
          title,
        },
      });
    } catch (e) {
      console.log(e);
      return {
        error: "Cannot Update Board",
      };
    }

    revalidatePath(`/board/${board.id}`);
    return {
      data: board,
    };
  } else {
    return {
      error: "Something went wrong",
    };
  }
};
export const updateBoard = createSafeAction(UpdateBoard, handler);
