import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateQuote } from "@/hooks/useQuotes";
import type { CreateQuoteInput } from "@/types";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const SERVICES = [
  "Project Report Binding",
  "Spiral Binding",
  "Self Ink Stamp",
  "Visiting Cards",
  "Brochures & Flyers",
  "Flex Banner",
  "Digital / Offset Printing",
  "Wedding Cards",
  "Packaging & Labels",
  "T-Shirts & Promo Items",
  "Other",
];

const BUDGETS = [
  "Under ₹500",
  "₹500 – ₹2,000",
  "₹2,000 – ₹10,000",
  "Above ₹10,000",
];

const TIMELINES = ["Urgent – Same Day", "1–2 Days", "3–5 Days", "1 Week+"];

const defaultForm: CreateQuoteInput = {
  name: "",
  email: "",
  phone: "",
  serviceType: "",
  projectDetails: "",
  budgetRange: "",
  timeline: "",
};

export function QuoteFormSection() {
  const [form, setForm] = useState<CreateQuoteInput>(defaultForm);
  const mutation = useCreateQuote();
  const { mutate, isPending, isSuccess } = mutation;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <section
      id="quote"
      className="py-16 md:py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.25 0.18 261) 0%, oklch(0.33 0.2 261) 60%, oklch(0.28 0.14 280) 100%)",
      }}
      data-ocid="quote-section"
    >
      {/* Decorative */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.85 0.15 60) 0%, transparent 70%)",
          transform: "translate(25%, -25%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">
              Get an Instant Quote
            </h2>
            <p className="text-white/75 font-body text-lg">
              Fill in your details and we'll get back to you within minutes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card/95 backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8 shadow-elevated"
          >
            {isSuccess ? (
              <div
                className="flex flex-col items-center gap-4 py-10 text-center"
                data-ocid="quote-success"
              >
                <CheckCircle2 className="w-16 h-16 text-accent" />
                <h3 className="font-display font-bold text-2xl text-foreground">
                  Quote Request Sent!
                </h3>
                <p className="text-muted-foreground font-body max-w-sm">
                  Thank you! We'll review your request and call you back within
                  30 minutes during business hours.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setForm(defaultForm);
                    mutation.reset();
                  }}
                  data-ocid="quote-reset"
                >
                  Submit Another Quote
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="name"
                    className="font-display text-sm font-medium"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Rahul Sharma"
                    value={form.name}
                    onChange={handleChange}
                    required
                    data-ocid="quote-name"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="email"
                    className="font-display text-sm font-medium"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="rahul@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    data-ocid="quote-email"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="phone"
                    className="font-display text-sm font-medium"
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    data-ocid="quote-phone"
                  />
                </div>

                {/* Service Type */}
                <div className="flex flex-col gap-1.5">
                  <Label className="font-display text-sm font-medium">
                    Service Type *
                  </Label>
                  <Select
                    value={form.serviceType}
                    onValueChange={(v) =>
                      setForm((prev) => ({ ...prev, serviceType: v }))
                    }
                    required
                  >
                    <SelectTrigger data-ocid="quote-service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget Range */}
                <div className="flex flex-col gap-1.5">
                  <Label className="font-display text-sm font-medium">
                    Budget Range *
                  </Label>
                  <Select
                    value={form.budgetRange}
                    onValueChange={(v) =>
                      setForm((prev) => ({ ...prev, budgetRange: v }))
                    }
                    required
                  >
                    <SelectTrigger data-ocid="quote-budget">
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGETS.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Timeline */}
                <div className="flex flex-col gap-1.5">
                  <Label className="font-display text-sm font-medium">
                    Timeline *
                  </Label>
                  <Select
                    value={form.timeline}
                    onValueChange={(v) =>
                      setForm((prev) => ({ ...prev, timeline: v }))
                    }
                    required
                  >
                    <SelectTrigger data-ocid="quote-timeline">
                      <SelectValue placeholder="How soon?" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMELINES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Project Details */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <Label
                    htmlFor="projectDetails"
                    className="font-display text-sm font-medium"
                  >
                    Project Details
                  </Label>
                  <Textarea
                    id="projectDetails"
                    name="projectDetails"
                    placeholder="Describe your project — quantity, size, paper type, special requirements..."
                    value={form.projectDetails}
                    onChange={handleChange}
                    rows={4}
                    data-ocid="quote-details"
                  />
                </div>

                {/* Submit */}
                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-display font-bold text-base"
                    disabled={isPending}
                    data-ocid="quote-submit"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending Quote Request...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Quote Request
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2 font-body">
                    We respond within 30 minutes during business hours
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
