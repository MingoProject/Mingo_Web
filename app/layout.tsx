import React, { useEffect } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ChatItemProvider } from "@/context/ChatItemContext";
import { ChatProvider } from "@/context/ChatContext";
import { SocketProvider } from "@/providers/SocketProvider";

export const metadata: Metadata = {
  title: "Mingle",
  description: "Social Network",
  icons: {
    icon: "/public//assets/images/site-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SocketProvider>
        <ChatItemProvider>
          <ChatProvider>
            <html lang="en">
              <body className="relative">
                <ClerkProvider
                  appearance={{
                    elements: {
                      formButtonPrimary: "primary-gradient",
                      footerActionLink:
                        "primary-gradient hover:text-primary-500",
                    },
                  }}
                >
                  <ThemeProvider>{children}</ThemeProvider>
                </ClerkProvider>
              </body>
            </html>
          </ChatProvider>
        </ChatItemProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
