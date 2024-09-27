"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/create-audit-log";
import { ENTITY_TYPE, ACTION } from "@prisma/client";
import { decrementAvailableCount } from "@/lib/org-limit";

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
      let board = await prisma.board.delete({
        where: {
          id,
          orgId,
        },
      });
      await decrementAvailableCount();
      await createAuditLog({
        entityTitle: board.title,
        entityId: board.id,
        entityType: ENTITY_TYPE.BOARD,
        action: ACTION.DELETE,
      });
    } catch (e) {
      console.log(e);
      return {
        error: "Cannot Delete Board",
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
