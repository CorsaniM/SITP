import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import {
  ClerkProvider,
} from '@clerk/nextjs'

import { SyncActiveOrganization } from "./_components/SyncActiveOrganization";
import { auth } from "@clerk/nextjs/server";


export const metadata = {
  title: "Generar tickets",
  description: "IanTech",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  const { userId, sessionClaims } = auth();

  
  return (
    <ClerkProvider>
      <SyncActiveOrganization membership={sessionClaims!.membership!}/>
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="h-screen">
          <div className='flex'>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </div>
      </body>
    </html>
    </ClerkProvider>
  );
}

