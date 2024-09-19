"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./type";
import { prisma } from "@/lib/prisma";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId && !orgId) {
    return {
      error: "UnAuthorized user",
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
