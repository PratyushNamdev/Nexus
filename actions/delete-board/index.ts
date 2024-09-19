"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { redirect } from "next/navigation";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = auth();

  if (!orgId || !userId) {
    return {
      error: "UnAuthorized",
    };
  }

  const { id } = data;

  if (orgId) {
    try {
      await prisma.board.delete({
        where: {
          id,
          orgId,
        },
      });
    } catch (e) {
      console.log(e);
      return {
        error: "Cannot Update Board",
      };
    }

    revalidatePath(`/organization/${orgId}`);
    redirect(`/organization/${orgId}`);
  } else {
    return {
      error: "Something went wrong",
    };
  }
};
export const deleteBoard = createSafeAction(DeleteBoard, handler);
