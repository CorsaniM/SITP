"use server";
import { api } from "~/trpc/server";
import { Title } from "~/app/_components/ui/title";
import CompanyPage from "./companie";
import { db } from "~/server/db"; 
import { userCompanies } from "~/server/db/schema"; 
import { eq } from "drizzle-orm";

type User = {
  id: string;
  name: string;
  email: string;
};

export default async function Page(props: { params: { empresaId: string } }) {
  const id = parseInt(props.params.empresaId);
  if (isNaN(id)) {
    throw new Error("Invalid empresaId");
  }

  const company = await api.companies.get({ id });

  let userList: User[] = [];

  try {
   
    const userResults = await db
      .select({
        id: userCompanies.userId,
        name: userCompanies.userName,
      })
      .from(userCompanies)
      .where(eq(userCompanies.orgId, id))

    userList = userResults.map(user => ({
      id: user.id,
      name: user.name,
      email: "",
    }));

    
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }

  if (!company) {
    return <Title>No se encontró la entidad</Title>;
  }

  return <CompanyPage company={company} userList={userList} />;
}
