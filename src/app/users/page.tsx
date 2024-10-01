"use client";
// import { clerkClient } from "@clerk/nextjs/react";
import { List, ListTile } from "~/app/_components/ui/list";

import { Title } from "~/app/_components/ui/title";
import LayoutContainer from "~/app/_components/layout-container";
import { UseCheckRole } from "~/lib/server/roles";
import { api } from "~/trpc/react";

// export type UsersType = Awaited<
//   ReturnType<typeof clerkClient.users.getUserList>
// >["data"][number];

export default function AdminDashboard() {
  

  const {data: usersList} =  api.clerk.list.useQuery();

const isAdmin = UseCheckRole("Admin");





  return (
    <>
    <LayoutContainer>
      <div className=" ">
      <Title>Usuarios</Title>
      {isAdmin ? (
        <List>
          {usersList ? usersList.data.map((usuario) => (
            <ListTile
              key={usuario.id}
              href={`./users/${usuario.id}`}
              className="flex-row"
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
                <div className="flex mx-1">
                  <img
                    className="h-11 w-12 rounded-full"
                    src={usuario.imageUrl}
                    alt="User Profile"
                    />
                </div>
              }
              />
          )) : (
            <h1>No hay usuarios</h1>
          )}
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
