"use server";
import { clerkClient } from "@clerk/nextjs/server";
import { setRole } from "~/app/_actions";
import { List, ListTile } from "~/app/_components/ui/list";

import { Title } from "~/app/_components/ui/title";
import { Input } from "~/app/_components/ui/input";
import { Button } from "~/app/_components/ui/button";
import { checkRole } from "~/lib/server/roles";
import { getServerAuthSession } from "~/server/auth";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import LayoutContainer from "~/app/_components/layout-container";

export type UsersType = Awaited<
  ReturnType<typeof clerkClient.users.getUserList>
>["data"][number];

export default async function AdminDashboard() {
  

  const usersList = (await clerkClient.users.getUserList({})).data;
  const organizations = (
    await clerkClient.organizations.getOrganizationList({})
  ).data;

  const session = await getServerAuthSession();

  const user = usersList.find((users) => users.id === session!.user.id);

  const organization = organizations.find((x) => x.id === session?.orgId);

  console.log("Prueba", session, user)

console.log("plop", usersList.length)


// const isAdmin = checkRole("admin");
const isAdmin = true

console.log("Render - user:", user);
console.log("Render - isAdmin:", isAdmin);




  return (
    <>
    <LayoutContainer>
      <div className="mt-8">
      <Title>Usuarios</Title>
      {isAdmin ? (
        <List>
          {usersList.map((user) => (
            <ListTile
              key={user.id}
              href={`./users/${user.id}`}
              title={
                <>
                  {user.firstName} {user.lastName}
                </>
              }
              subtitle={
                user.emailAddresses.find(
                  (email) => email.id === user.primaryEmailAddressId
                )?.emailAddress
              }
              leading={
                <div>
                  <img
                    className="h-10 rounded-full"
                    src={user.imageUrl}
                    alt="User Profile"
                  />
                </div>
              }
            />
          ))}
        </List>
      ) : user ? (
        <List>
          <ListTile
            href={`./users/${user.id}`}
            title={
              <>
                {user.firstName} {user.lastName}
              </>
            }
            subtitle={
              user.emailAddresses.find(
                (email) => email.id === user.primaryEmailAddressId
              )?.emailAddress
            }
            leading={
              <div>
                <img
                  className="h-10 rounded-full"
                  src={user.imageUrl}
                  alt="User Profile"
                />
              </div>
            }
          />
        </List>
      ) : (
        <h1>Acceso denegado</h1>
      )}
      </div>
    </LayoutContainer>
    </>

  );
}

function FormSetRole({ user }: { user: UsersType }) {
  return (
    <div className="flex gap-2">
      <div>
        <form action={setRole}>
          <Input type="hidden" value={user.id} name="id" />
          <Input type="hidden" value="admin" name="role" />
          <Button type="submit">Hacer admin </Button>
        </form>
      </div>
      <div>
        <form action={setRole}>
          <Input type="hidden" value={user.id} name="id" />
          <Input type="hidden" value="user" name="role" />
          <Button type="submit">Autorizar usuario</Button>
        </form>
      </div>
      <div>
        <form action={setRole}>
          <Input type="hidden" value={user.id} name="id" />
          <Input type="hidden" value="unauthorized" name="role" />
          <Button type="submit">Desautorizar</Button>
        </form>
      </div>
    </div>
  );
}
