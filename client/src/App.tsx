import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import ConversasPage from "@/pages/conversas";
import ComunicadosPage from "@/pages/comunicados";
import PessoasPage from "@/pages/pessoas";
import CanaisPage from "@/pages/canais";
import GruposPage from "@/pages/grupos";
import ConfiguracoesPage from "@/pages/configuracoes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/conversas" component={ConversasPage} />
      <Route path="/comunicados" component={ComunicadosPage} />
      <Route path="/pessoas" component={PessoasPage} />
      <Route path="/canais" component={CanaisPage} />
      <Route path="/grupos" component={GruposPage} />
      <Route path="/configuracoes" component={ConfiguracoesPage} />
      <Route path="/conversation-analytics" component={ConversationAnalytics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  React.useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;