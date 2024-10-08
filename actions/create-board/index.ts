"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./type";
import { prisma } from "@/lib/prisma";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ENTITY_TYPE, ACTION } from "@prisma/client";
import { incrementAvailableCount, hasAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId && !orgId) {
    return {
      error: "UnAuthorized user",
    };
  }
  const canCreate = await hasAvailableCount();
  const isPro = await checkSubscription();
  if (!canCreate && !isPro) {
    return {
      error:
        "Maximun limit of active boards is reached. Upgrade to Pro to have unlimited boards",
    };
  }
  const { title, image } = data;
  const [
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageLINKHTML,
    imageUserName,
  ] = image.split("|");

  if (
    !imageId ||
    !imageFullUrl ||
    !imageLINKHTML ||
    !imageUserName ||
    !imageThumbUrl
  ) {
    return {
      error: "Missing Image fields. Try different image",
    };
  }
  let board;
  if (orgId) {
    try {
      board = await prisma.board.create({
        data: {
          title,
          orgId,
          imageId,
          imageFullUrl,
          imageLINKHTML,
          imageUserName,
          imageThumbUrl,
        },
      });
      if (!isPro) {
        await incrementAvailableCount();
      }
      await createAuditLog({
        entityTitle: board.title,
        entityId: board.id,
        entityType: ENTITY_TYPE.BOARD,
        action: ACTION.CREATE,
      });
    } catch (e) {
      return {
        error: "Failed to create board",
      };
    }

    revalidatePath(`/board/${board.id}`);

    return {
      data: board,
    };
  }
  return {
    error: "Something went wrong",
  };
};
export const createBoard = createSafeAction(CreateBoard, handler);
