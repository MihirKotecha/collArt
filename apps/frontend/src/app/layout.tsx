import "@repo/tailwind-config/globalCss"
import { ErrorToaster } from "@repo/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <ErrorToaster />
        </AuthProvider>
      </body>
    </html>
  );
}
