"use server";
import { clerkClient } from "@clerk/nextjs/server";
import { List, ListTile } from "~/app/_components/ui/list";

import { Title } from "~/app/_components/ui/title";
import LayoutContainer from "~/app/_components/layout-container";
import { UseCheckRole } from "~/lib/server/roles";

export type UsersType = Awaited<
  ReturnType<typeof clerkClient.users.getUserList>
>["data"][number];

export default async function AdminDashboard() {
  

  const {data: usersList} = (await clerkClient.users.getUserList({}));
  // const organizations = (
  //   await clerkClient.organizations.getOrganizationList({})
  // ).data;


  
  // const organization = organizations.find((x) => x.id === session?.orgId);
  
  // const user = usersList.find((users) => users.id === session!.user.id);



const isAdmin = UseCheckRole("Admin");





  return (
    <>
    <LayoutContainer>
      <div className="m-5 space-y-5">
      <Title>Usuarios</Title>
      {isAdmin ? (
        <List>
          {usersList.map((usuario) => (
            <ListTile
              key={usuario.id}
              href={`./users/${usuario.id}`}
              title={
                <>
                  {usuario.firstName} {usuario.lastName}
                </>
              }
              subtitle={
                usuario.emailAddresses.find(
                  (email) => email.id === usuario.primaryEmailAddressId
                )?.emailAddress
              }
              leading={
                <div>
                  <img
                    className="h-10 rounded-full"
                    src={usuario.imageUrl}
                    alt="User Profile"
                  />
                </div>
              }
            />
          ))}
        </List>
      ) 
       : (
        <h1>Acceso denegado</h1>
      )}
      </div>
    </LayoutContainer>
    </>

  );
}

// function FormSetRole({ user }: { user: UsersType }) {
//   return (
//     <div className="flex gap-2">
//       <div>
//         <form action={SetRole}>
//           <Input type="hidden" value={user.id} name="id" />
//           <Input type="hidden" value="admin" name="role" />
//           <Button type="submit">Hacer admin </Button>
//         </form>
//       </div>
//       <div>
//         <form action={SetRole}>
//           <Input type="hidden" value={user.id} name="id" />
//           <Input type="hidden" value="user" name="role" />
//           <Button type="submit">Autorizar usuario</Button>
//         </form>
//       </div>
//       <div>
//         <form action={SetRole}>
//           <Input type="hidden" value={user.id} name="id" />
//           <Input type="hidden" value="unauthorized" name="role" />
//           <Button type="submit">Desautorizar</Button>
//         </form>
//       </div>
//     </div>
//   );
// }
