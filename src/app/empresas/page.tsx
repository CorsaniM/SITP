import LayoutContainer from "../_components/layout-container";
import { List, ListTile } from "../_components/ui/list";
import { Title } from "../_components/ui/title";
import { api } from "~/trpc/server";
import { AddCompanyDialog } from "./add-company-dialog";
// import { AddCompanyDialog } from "./add-company-dialog";

export default async function Home() {
  const companies = await api.companies.list();

  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Entidades</Title>
          <AddCompanyDialog />
        </div>
        <List>
          {companies.map((company) => {
            return (
              <ListTile
                key={company.id}
                href={`/empresas/${company.id}`}
                title={company.name}
              />
            );
          })}
        </List>
      </section>
    </LayoutContainer>
  );
}