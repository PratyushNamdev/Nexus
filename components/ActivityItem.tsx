import { AuditLog } from "@prisma/client";

interface ActivityItemProps {
  data: AuditLog;
}
export const ActivityItem = ({ data }: ActivityItemProps) => {
  return <div>{data.entityTitle}</div>;
};
