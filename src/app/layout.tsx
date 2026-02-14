
import type { Metadata } from "next";

import "./globals.css";
import ClientProvider from "@/ClientProvider";
import UserContext from "@/context/UserContext";


export const metadata: Metadata = {
  title: "My First Full Stack Project Using Next JS",
  description: "this is my first project of Ultimate Backend Course",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
   <ClientProvider>
    <UserContext>
        {children}
    </UserContext>
    </ClientProvider>
      
      </body>
    </html>
  );
}
