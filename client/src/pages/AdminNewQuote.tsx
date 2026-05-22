import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Wand2, Save, ChevronRight, X } from "lucide-react";

type ParsedQuote = {
  clientName: string;
  bedrooms: number;
  bathrooms: number;
  serviceType: string;
  extras: string[];
  notes: string;
  estimateMin: string;
  estimateMax: string;
};

export default function AdminNewQuote() {
  const [, navigate] = useLocation();
  const [rawInput, setRawInput] = useState("");
  const [parsed, setParsed] = useState<ParsedQuote | null>(null);
  const [ctaLabel, setCtaLabel] = useState<"Book This Cleaning" | "Confirm My Date & Time">("Book This Cleaning");

  const parseQuote = trpc.quote.parse.useMutation({
    onSuccess: (data) => {
      setParsed({
        ...data,
        estimateMin: data.estimateMin > 0 ? String(data.estimateMin) : "",
        estimateMax: data.estimateMax > 0 ? String(data.estimateMax) : "",
      });
      toast.success("Quote parsed — review and save below");
    },
    onError: (e) => toast.error(e.message || "Failed to parse quote"),
  });

  const createQuote = trpc.quote.createFromParsed.useMutation({
    onSuccess: (quote) => {
      toast.success(`Quote created for ${quote.clientName}`);
      navigate("/admin");
    },
    onError: (e) => toast.error(e.message || "Failed to create quote"),
  });

  const handleParse = () => {
    if (!rawInput.trim()) { toast.error("Please enter lead details"); return; }
    parseQuote.mutate({ rawInput });
  };

  const handleSave = () => {
    if (!parsed) { toast.error("Please parse the quote first"); return; }
    createQuote.mutate({
      clientName: parsed.clientName,
      bedrooms: parsed.bedrooms,
      bathrooms: parsed.bathrooms,
      serviceType: parsed.serviceType,
      extras: parsed.extras,
      notes: parsed.notes,
      estimateMin: parsed.estimateMin !== "" ? Number(parsed.estimateMin) : null,
      estimateMax: parsed.estimateMax !== "" ? Number(parsed.estimateMax) : null,
      ctaLabel,
    });
  };

  const updateField = <K extends keyof ParsedQuote>(key: K, value: ParsedQuote[K]) => {
    if (!parsed) return;
    setParsed({ ...parsed, [key]: value });
  };

  const removeExtra = (extra: string) => {
    if (!parsed) return;
    setParsed({ ...parsed, extras: parsed.extras.filter(e => e !== extra) });
  };

  const addExtra = (extra: string) => {
    if (!parsed || !extra.trim()) return;
    if (!parsed.extras.includes(extra)) {
      setParsed({ ...parsed, extras: [...parsed.extras, extra] });
    }
  };

  return (
    <AdminLayout title="New Quote">
      <div className="max-w-2xl">
        {/* Step 1: Raw input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-foreground mb-2">
            Lead Details
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            Paste or type raw lead notes. The AI will extract all structured fields automatically.
          </p>
          <textarea
            value={rawInput}
            onChange={e => setRawInput(e.target.value)}
            placeholder={`e.g. "Sarah, 3 bed / 2 bath, standard clean, add oven and fridge, has a dog, focus on kitchen, estimate $150–$200"`}
            rows={4}
            className="w-full bg-secondary border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ember"
          />
          <div className="flex gap-3 mt-3">
            <Button
              onClick={handleParse}
              disabled={parseQuote.isPending || !rawInput.trim()}
              className="bg-secondary hover:bg-secondary/80 text-foreground border border-border gap-2"
              variant="outline"
            >
              {parseQuote.isPending ? (
                <div className="w-4 h-4 border border-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Wand2 size={15} />
              )}
              Parse with AI
            </Button>
            {parsed && (
              <Button
                onClick={handleSave}
                disabled={createQuote.isPending}
                className="bg-ember hover:bg-ember/90 text-white gap-2"
              >
                {createQuote.isPending ? (
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                Save Quote
                <ChevronRight size={15} />
              </Button>
            )}
          </div>
        </div>

        {/* Step 2: Parsed preview */}
        {parsed && (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-secondary/50 px-5 py-3 border-b border-border flex items-center justify-between">
              <h3 className="font-medium text-sm text-foreground">Parsed Quote — Review & Edit</h3>
              <span className="text-xs text-ember bg-ember/10 px-2 py-0.5 rounded-full">AI Parsed</span>
            </div>

            <div className="p-5 grid grid-cols-2 gap-4">
              {/* Client Name */}
              <div className="col-span-2">
                <label className="block text-xs text-muted-foreground mb-1">Client Name</label>
                <input
                  value={parsed.clientName}
                  onChange={e => updateField("clientName", e.target.value)}
                  className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember"
                />
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Bedrooms</label>
                <input
                  type="number"
                  min={0}
                  value={parsed.bedrooms}
                  onChange={e => updateField("bedrooms", Number(e.target.value))}
                  className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember"
                />
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Bathrooms</label>
                <input
                  type="number"
                  min={0}
                  value={parsed.bathrooms}
                  onChange={e => updateField("bathrooms", Number(e.target.value))}
                  className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember"
                />
              </div>

              {/* Service Type */}
              <div className="col-span-2">
                <label className="block text-xs text-muted-foreground mb-1">Service Type</label>
                <input
                  value={parsed.serviceType}
                  onChange={e => updateField("serviceType", e.target.value)}
                  className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember"
                />
              </div>

              {/* Estimate */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Estimate Min ($)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 150"
                  value={parsed.estimateMin}
                  onChange={e => updateField("estimateMin", e.target.value.replace(/[^0-9.]/g, "") as any)}
                  className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Estimate Max ($)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 200"
                  value={parsed.estimateMax}
                  onChange={e => updateField("estimateMax", e.target.value.replace(/[^0-9.]/g, "") as any)}
                  className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember"
                />
              </div>

              {/* Extras */}
              <div className="col-span-2">
                <label className="block text-xs text-muted-foreground mb-2">Extra Services</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {parsed.extras.map(extra => (
                    <span key={extra} className="flex items-center gap-1 bg-ember/15 text-ember text-xs px-2.5 py-1 rounded-full">
                      {extra}
                      <button onClick={() => removeExtra(extra)} className="hover:text-white ml-0.5">
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {["Oven Cleaning", "Fridge Cleaning", "Window Cleaning", "Laundry"].filter(e => !parsed.extras.includes(e)).map(e => (
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

              {/* Notes */}
              <div className="col-span-2">
                <label className="block text-xs text-muted-foreground mb-1">Notes</label>
                <textarea
                  value={parsed.notes}
                  onChange={e => updateField("notes", e.target.value)}
                  rows={2}
                  className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ember"
                />
              </div>

              {/* CTA Label */}
              <div className="col-span-2">
                <label className="block text-xs text-muted-foreground mb-2">CTA Button Label</label>
                <div className="flex gap-3">
                  {(["Book This Cleaning", "Confirm My Date & Time"] as const).map(label => (
                    <button
                      key={label}
                      onClick={() => setCtaLabel(label)}
                      className={`text-sm px-4 py-2 rounded-md border transition-colors ${
                        ctaLabel === label
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

            <div className="px-5 py-4 border-t border-border bg-secondary/30 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={createQuote.isPending}
                className="bg-ember hover:bg-ember/90 text-white gap-2"
              >
                {createQuote.isPending ? (
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                Save & Generate Link
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
