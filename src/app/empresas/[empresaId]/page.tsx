"use server";
import { api } from "~/trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import { Title } from "~/app/_components/ui/title";
import CompanyPage from "./companie";
type User = {
  id: string;
  name: string;
  email: string;
};
export default async function Page(props: {
  params: { companySubId: string };
}) {

const id = parseInt(props.params.companySubId)
  const company = await api.companies.get({
    id: id,
  });

  const userList: User[] = [];

  try {
    const response =
      await clerkClient.organizations.getOrganizationMembershipList({
        organizationId: props.params.companySubId,
      });

    console.log("Response:", response); // Check the entire response object

    if (response.data?.length > 0) {
      console.log("Data length:", response.data.length); // Check length of 'data'

      for (const user of response.data) {
        console.log("User:", user); // Check each 'user' object

        const fullName = `${user.publicUserData?.firstName ?? ""} ${
          user.publicUserData?.lastName ?? ""
        }`;

        userList.push({
          id: user.publicUserData?.userId ?? "",
          name:fullName ?? "No name",
          email: user.publicUserData?.identifier ?? "",
        });
      }
    } else {
      console.log("No data found in response.");
    }
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }

  console.log("User list:", userList); // Check the final state of 'userList'

  if (!company) {
    return <Title>No se encontró la entidad</Title>;
  }

  return (
    <CompanyPage
      company={company}
      userList={userList}
    />
  );
}
