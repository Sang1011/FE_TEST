"use client";

import "antd/dist/reset.css"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState, Suspense } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </QueryClientProvider>
      </body>
    </html>
  );
}
