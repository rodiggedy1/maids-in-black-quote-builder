import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLocation, useParams } from "wouter";
import { Save, Copy, ExternalLink, X } from "lucide-react";

export default function AdminEditQuote() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  const { data: quote, isLoading } = trpc.quote.getBySlug.useQuery({ slug });

  const [form, setForm] = useState({
    clientName: "",
    bedrooms: 0,
    bathrooms: 0,
    serviceType: "Standard Cleaning",
    extras: [] as string[],
    notes: "",
    estimateMin: 0,
    estimateMax: 0,
    ctaLabel: "Book This Cleaning" as "Book This Cleaning" | "Confirm My Date & Time",
  });

  useEffect(() => {
    if (quote) {
      setForm({
        clientName: quote.clientName,
        bedrooms: quote.bedrooms,
        bathrooms: quote.bathrooms,
        serviceType: quote.serviceType,
        extras: quote.extras,
        notes: quote.notes || "",
        estimateMin: quote.estimateMin ? Number(quote.estimateMin) : 0,
        estimateMax: quote.estimateMax ? Number(quote.estimateMax) : 0,
        ctaLabel: quote.ctaLabel,
      });
    }
  }, [quote]);

  const updateQuote = trpc.quote.update.useMutation({
    onSuccess: () => {
      utils.quote.list.invalidate();
      utils.quote.getBySlug.invalidate({ slug });
      toast.success("Quote updated — client page is now live");
    },
    onError: (e) => toast.error(e.message || "Failed to update quote"),
  });

  const handleSave = () => {
    updateQuote.mutate({
      slug,
      ...form,
      estimateMin: form.estimateMin || null,
      estimateMax: form.estimateMax || null,
    });
  };

  const copyLink = () => {
    const url = `${window.location.origin}/q/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const removeExtra = (extra: string) => setForm(f => ({ ...f, extras: f.extras.filter(e => e !== extra) }));
  const addExtra = (extra: string) => {
    if (!form.extras.includes(extra)) setForm(f => ({ ...f, extras: [...f.extras, extra] }));
  };

  if (isLoading) {
    return (
      <AdminLayout title="Edit Quote">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!quote) {
    return (
      <AdminLayout title="Edit Quote">
        <div className="text-center py-20">
          <p className="text-muted-foreground">Quote not found.</p>
          <Button onClick={() => navigate("/admin")} className="mt-4" variant="outline">Back to Dashboard</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit — ${quote.clientName}`}>
      <div className="max-w-2xl">
        {/* Quick actions */}
        <div className="flex gap-3 mb-6">
          <Button variant="outline" onClick={copyLink} className="gap-2 text-sm border-border">
            <Copy size={14} /> Copy Client Link
          </Button>
          <Button variant="outline" onClick={() => window.open(`/q/${slug}`, "_blank")} className="gap-2 text-sm border-border">
            <ExternalLink size={14} /> Preview
          </Button>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-secondary/50 px-5 py-3 border-b border-border">
            <h3 className="font-medium text-sm text-foreground">Quote Details</h3>
          </div>

          <div className="p-5 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-muted-foreground mb-1">Client Name</label>
              <input
                value={form.clientName}
                onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember"
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Bedrooms</label>
              <input
                type="number" min={0}
                value={form.bedrooms}
                onChange={e => setForm(f => ({ ...f, bedrooms: Number(e.target.value) }))}
                className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Bathrooms</label>
              <input
                type="number" min={0}
                value={form.bathrooms}
                onChange={e => setForm(f => ({ ...f, bathrooms: Number(e.target.value) }))}
                className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-muted-foreground mb-1">Service Type</label>
              <input
                value={form.serviceType}
                onChange={e => setForm(f => ({ ...f, serviceType: e.target.value }))}
                className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember"
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Estimate Min ($)</label>
              <input
                type="number" min={0}
                value={form.estimateMin}
                onChange={e => setForm(f => ({ ...f, estimateMin: Number(e.target.value) }))}
                className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Estimate Max ($)</label>
              <input
                type="number" min={0}
                value={form.estimateMax}
                onChange={e => setForm(f => ({ ...f, estimateMax: Number(e.target.value) }))}
                className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-muted-foreground mb-2">Extra Services</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.extras.map(extra => (
                  <span key={extra} className="flex items-center gap-1 bg-ember/15 text-ember text-xs px-2.5 py-1 rounded-full">
                    {extra}
                    <button onClick={() => removeExtra(extra)} className="hover:text-white ml-0.5">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {["Oven Cleaning", "Fridge Cleaning", "Window Cleaning", "Laundry"].filter(e => !form.extras.includes(e)).map(e => (
                  <button
                    key={e}
                    onClick={() => addExtra(e)}
                    className="text-xs text-muted-foreground border border-border rounded-full px-2.5 py-1 hover:border-ember hover:text-ember transition-colors"
                  >
                    + {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-muted-foreground mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ember"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-muted-foreground mb-2">CTA Button Label</label>
              <div className="flex gap-3">
                {(["Book This Cleaning", "Confirm My Date & Time"] as const).map(label => (
                  <button
                    key={label}
                    onClick={() => setForm(f => ({ ...f, ctaLabel: label }))}
                    className={`text-sm px-4 py-2 rounded-md border transition-colors ${
                      form.ctaLabel === label
                        ? "border-ember bg-ember/15 text-ember"
                        : "border-border text-muted-foreground hover:border-ember/50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-border bg-secondary/30 flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/admin")} className="text-muted-foreground">
              ← Back
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateQuote.isPending}
              className="bg-ember hover:bg-ember/90 text-white gap-2"
            >
              {updateQuote.isPending ? (
                <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={15} />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
