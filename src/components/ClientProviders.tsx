import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SearchProvider } from "@/context/SearchContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { LanguageProvider } from "@/context/LanguageContext";

const queryClient = new QueryClient();

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <SubscriptionProvider>
            <SearchProvider>
              <TooltipProvider>
                {children}
                <Sonner />
              </TooltipProvider>
            </SearchProvider>
          </SubscriptionProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
