import { auth, isAuthorizedAdmin } from "@/lib/auth";
import DashboardApp from "@/components/dashboard/DashboardApp";
import { DeniedView, SignInView } from "@/components/dashboard/gate";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return <SignInView />;
  }

  if (!isAuthorizedAdmin(session)) {
    return <DeniedView />;
  }

  return <DashboardApp />;
}