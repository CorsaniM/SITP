import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider, useUser} from '@clerk/nextjs'
import { SyncActiveOrganization } from "./_components/SyncActiveOrganization";
import { auth } from "@clerk/nextjs/server";
import Upbar from "./_components/upbar";
import Sidebar from "./_components/sidebar";

export const metadata = {
  title: "Sistema de tickets",
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
        <div className="fixed top h-16">
          <Upbar/>
        </div>
        <div className='list-none fixed top-20 bottom-0 left-0 flex flex-col shadow-xl sm:flex h-full'>
          <Sidebar/>
        </div>
          <div className='flex'>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </div>
      </body>
    </html>
    </ClerkProvider>
  );
}

