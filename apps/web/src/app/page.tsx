import { Button } from "~/components/ui/button";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await db.user.findFirst();

  return <Button>{user?.name}</Button>;
}
