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
      <SyncActiveOrganization membership={sessionClaims?.membership}/>
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className=" bg-gray-600  text-gray-200">
        <div className="fixed h-16 left-0 w-full bg-gray-800 text-white shadow-md z-20 ">
          <Upbar/>
        </div>
        <div className='fixed pt-16 flex-1 h-full list-none w-36  shadow-2xl bg-gray-800 z-10'>
            <Sidebar/>
        </div>
        <div className='flex-1 pt-16 pl-36'>
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

