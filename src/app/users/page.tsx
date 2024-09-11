"use server";
import { clerkClient } from "@clerk/nextjs/server";
import { SetRole } from "~/app/_actions";
import { List, ListTile } from "~/app/_components/ui/list";

import { Title } from "~/app/_components/ui/title";
import { Input } from "~/app/_components/ui/input";
import { Button } from "~/app/_components/ui/button";
import { UseCheckRole } from "~/lib/server/roles";
import { getServerAuthSession } from "~/server/auth";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import LayoutContainer from "~/app/_components/layout-container";

export type UsersType = Awaited<
  ReturnType<typeof clerkClient.users.getUserList>
>["data"][number];

export default async function AdminDashboard() {
  

  const {data: usersList} = (await clerkClient.users.getUserList({}));
  const organizations = (
    await clerkClient.organizations.getOrganizationList({})
  ).data;

  const session = getServerAuthSession();

  const user = usersList.find((users) => users.id === session!.user.id);

  const organization = organizations.find((x) => x.id === session?.orgId);

  console.log("Prueba", session, user)

console.log("plop", usersList.length)


const isAdmin = true





  return (
    <>
    <LayoutContainer>
      <div className="m-5 space-y-5">
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
        <form action={SetRole}>
          <Input type="hidden" value={user.id} name="id" />
          <Input type="hidden" value="admin" name="role" />
          <Button type="submit">Hacer admin </Button>
        </form>
      </div>
      <div>
        <form action={SetRole}>
          <Input type="hidden" value={user.id} name="id" />
          <Input type="hidden" value="user" name="role" />
          <Button type="submit">Autorizar usuario</Button>
        </form>
      </div>
      <div>
        <form action={SetRole}>
          <Input type="hidden" value={user.id} name="id" />
          <Input type="hidden" value="unauthorized" name="role" />
          <Button type="submit">Desautorizar</Button>
        </form>
      </div>
    </div>
  );
}
