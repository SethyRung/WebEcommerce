import { and, eq } from "drizzle-orm";
import { db } from "@nuxthub/db";
import { purchases } from "hub:db:schema";
import type { ResponseCode } from "#shared/types";
import { createResponse } from "#server/utils/response";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.user?.userId;

    if (!userId) {
      return createResponse(
        { code: "Unauthorized" as ResponseCode, message: "User not authenticated" },
        null,
      );
    }

    const id = getRouterParam(event, "id");

    if (!id) {
      return createResponse(
        { code: "InvalidRequest" as ResponseCode, message: "Purchase ID is required" },
        null,
      );
    }

    const purchase = await db.query.purchases.findFirst({
      where: and(eq(purchases.id, id), eq(purchases.userId, userId)),
      with: {
        game: {
          columns: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            category: true,
          },
        },
      },
    });

    if (!purchase) {
      return createResponse(
        { code: "NotFound" as ResponseCode, message: "Purchase not found" },
        null,
      );
    }

    return createResponse(
      { code: "Success" as ResponseCode, message: "Purchase retrieved successfully" },
      {
        id: purchase.id,
        userId: purchase.userId,
        gameId: purchase.gameId,
        game: purchase.game
          ? {
              id: (purchase.game as { id: string }).id,
              name: (purchase.game as { name: string }).name,
              description: (purchase.game as { description: string | null }).description,
              imageUrl: (purchase.game as { imageUrl: string | null }).imageUrl,
              category: (purchase.game as { category: string | null }).category,
            }
          : null,
        amount: purchase.amount.toString(),
        quantity: purchase.quantity,
        status: purchase.status,
        merchantReference: purchase.merchantReference,
        createdAt: purchase.createdAt?.toISOString() ?? null,
        updatedAt: purchase.updatedAt?.toISOString() ?? null,
      },
    );
  } catch (error) {
    console.error("Get purchase error:", error);
    return createResponse(
      {
        code: "InternalError" as ResponseCode,
        message: "An error occurred while retrieving purchase",
      },
      null,
    );
  }
});
