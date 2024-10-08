"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import { StripeRedirect } from "./schema";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId, userId } = auth();
  const user = await currentUser();
  if (!orgId || !userId || !user) {
    return {
      error: "UnAuthorized",
    };
  }

  const settingsUrl = absoluteUrl(`/organization/${orgId}`);
  let url = "";
  try {
    const orgSubscription = await prisma.orgSubscription.findUnique({
      where: {
        orgId,
      },
    });
    if (orgSubscription && orgSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });
      url = stripeSession.url;
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "required",
        customer_email: user?.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: "INR",
              product_data: {
                name: "Nexus Pro",
                description: "Unlimited boards for your organization",
              },
              unit_amount: 400000,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          orgId,
        },
      });
      url = stripeSession.url || "";
    }
  } catch (error) {
    console.log(error);
    return {
      error: "Something went wrong",
    };
  }
  revalidatePath(`/organizations/${orgId}`);
  return {
    data: url,
  };
};
export const stripeRedirect = createSafeAction(StripeRedirect, handler);
