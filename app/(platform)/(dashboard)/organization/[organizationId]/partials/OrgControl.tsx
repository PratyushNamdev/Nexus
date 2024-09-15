"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";

export const OrgControl = () => {
  const params = useParams();
  const { setActive } = useOrganizationList();
  console.log(params.organizationId);
  useEffect(() => {
    console.log("inside", params.organizationId);
    if (!setActive) return;
    setActive({
      organization: params.organizationId as string,
    });
  }, [setActive, params.organizationId]);
  return null;
};
