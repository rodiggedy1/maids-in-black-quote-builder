import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Copy, Pencil, Trash2, PlusCircle, ExternalLink, Heart, Link2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const { data: quotes, isLoading } = trpc.quote.list.useQuery();
  const deleteQuote = trpc.quote.delete.useMutation({
    onSuccess: () => {
      utils.quote.list.invalidate();
      toast.success("Quote deleted");
    },
    onError: () => toast.error("Failed to delete quote"),
  });

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/q/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Quote link copied");
  };

  const copyThankYouLink = (slug: string) => {
    const url = `${window.location.origin}/q/${slug}/thankyou`;
    navigator.clipboard.writeText(url);
    toast.success("Thank you link copied");
  };

  const formatEstimate = (min: string | null, max: string | null) => {
    if (!min && !max) return "—";
    const minN = min ? Number(min) : null;
    const maxN = max ? Number(max) : null;
    if (minN && maxN && minN !== maxN) return `$${minN}–$${maxN}`;
    if (minN) return `$${minN}`;
    if (maxN) return `$${maxN}`;
    return "—";
  };

  const [welcomeName, setWelcomeName] = useState("");

  const generateWelcomeLink = () => {
    const name = welcomeName.trim();
    if (!name) { toast.error("Enter a name first"); return; }
    const url = `${window.location.origin}/welcome/${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(url);
    toast.success(`Welcome link for ${name} copied!`);
  };

  return (
    <AdminLayout title="All Quotes">
      {/* Welcome Link Generator */}
      <div className="mb-6 p-4 rounded-xl border border-white/10 bg-secondary/30">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">Generate Welcome Link</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={welcomeName}
            onChange={e => setWelcomeName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && generateWelcomeLink()}
            placeholder="Client first name…"
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ember"
          />
          <Button
            onClick={generateWelcomeLink}
            className="bg-ember hover:bg-ember/90 text-white gap-2 shrink-0"
          >
            <Link2 size={15} />
            Copy Link
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground text-sm">
          {quotes?.length ?? 0} quote{quotes?.length !== 1 ? "s" : ""} created
        </p>
        <Button
          onClick={() => navigate("/admin/new")}
          className="bg-ember hover:bg-ember/90 text-white gap-2"
        >
          <PlusCircle size={16} />
          New Quote
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin" />
        </div>
      ) : quotes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <PlusCircle size={28} className="text-muted-foreground" />
          </div>
          <h3 className="font-serif text-xl mb-2">No quotes yet</h3>
          <p className="text-muted-foreground text-sm mb-6">Create your first personalized client quote</p>
          <Button onClick={() => navigate("/admin/new")} className="bg-ember hover:bg-ember/90 text-white">
            Create First Quote
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Client</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Home</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Service</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Estimate</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Created</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes?.map((quote, i) => (
                <tr
                  key={quote.slug}
                  className={`border-b border-border last:border-0 hover:bg-secondary/30 transition-colors ${i % 2 === 0 ? "" : "bg-secondary/10"}`}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">{quote.clientName}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {quote.bedrooms} bed / {quote.bathrooms} bath
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{quote.serviceType}</td>
                  <td className="px-4 py-3">
                    <span className="text-ember font-medium">
                      {formatEstimate(quote.estimateMin, quote.estimateMax)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(quote.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => window.open(`/q/${quote.slug}`, "_blank")}
                        title="Preview client page"
                      >
                        <ExternalLink size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-ember"
                        onClick={() => copyLink(quote.slug)}
                        title="Copy quote link"
                      >
                        <Copy size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-ember"
                        onClick={() => copyThankYouLink(quote.slug)}
                        title="Copy thank you page link"
                      >
                        <Heart size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => navigate(`/admin/edit/${quote.slug}`)}
                        title="Edit quote"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Delete quote for ${quote.clientName}?`)) {
                            deleteQuote.mutate({ slug: quote.slug });
                          }
                        }}
                        title="Delete quote"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
