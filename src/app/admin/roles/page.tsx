import { Title } from "~/app/_components/ui/title";
import { List, ListTile } from "~/app/_components/ui/list";
import LayoutContainer from "~/app/_components/layout-container";

import { api } from "~/trpc/server";

export default async function Home() {

  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Roles</Title>

        </div>
        
      </section>
    </LayoutContainer>
  );
}