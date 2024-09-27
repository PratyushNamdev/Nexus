"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateList } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

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
      await createAuditLog({
        entityTitle: list.title,
        entityId: list.id,
        entityType: ENTITY_TYPE.LIST,
        action: ACTION.UPDATE,
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
