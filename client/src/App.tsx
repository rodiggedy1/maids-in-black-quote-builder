import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminDashboard from "./pages/AdminDashboard";
import AdminNewQuote from "./pages/AdminNewQuote";
import AdminEditQuote from "./pages/AdminEditQuote";
import ClientQuotePage from "./pages/ClientQuotePage";
import BookingPage from "./pages/BookingPage";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/new" component={AdminNewQuote} />
      <Route path="/admin/edit/:slug" component={AdminEditQuote} />
      <Route path="/q/:slug" component={ClientQuotePage} />
      <Route path="/q/:slug/book" component={BookingPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
