import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider, useUser} from '@clerk/nextjs'
import { SyncActiveOrganization } from "./_components/SyncActiveOrganization";
import { auth } from "@clerk/nextjs/server";
import Upbar from "./_components/upbar";
import Sidebar from "./_components/sidebar";
import { Toaster } from "./_components/ui/sonner";

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

  const { sessionClaims } = auth();

  
  return (
    <ClerkProvider signInFallbackRedirectUrl={"/"}>
      <SyncActiveOrganization membership={sessionClaims!.membership!}/>
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-gray-600  text-gray-200">
        <div className="fixed h-16 left-0 w-full bg-gray-800 text-white shadow-md z-50 ">
          <Upbar/>
        </div>
        <div className='list-none w-36 fixed top-16 bottom-0 left-0 flex-col
        shadow-2xl bg-gray-800 sm:flex h-full'>
          <Sidebar/>
        </div>
          <div className='flex'>
            <TRPCReactProvider>
              {children}
              <Toaster />
            </TRPCReactProvider>
          </div>
      </body>
    </html>
    </ClerkProvider>
  );
}

