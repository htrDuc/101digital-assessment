"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field-label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/lib/constants";
import { ApiError, createInvoice } from "@/lib/client/api";
import {
  CURRENCIES,
  createInvoiceSchema,
  type CreateInvoiceInput,
} from "@/lib/validation/invoice";

function isoDate(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function Field({
  id,
  label,
  required,
  optional,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className ? `space-y-2 ${className}` : "space-y-2"}>
      <FieldLabel htmlFor={id} required={required} optional={optional}>
        {label}
      </FieldLabel>
      {children}
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function CreateInvoiceForm() {
  const router = useRouter();
  const [defaultValues] = useState<CreateInvoiceInput>(() => ({
    customerFirstName: "",
    customerLastName: "",
    customerEmail: "",
    customerMobile: "",
    invoiceNumber: `INV${Date.now()}`,
    invoiceReference: "",
    currency: "GBP",
    invoiceDate: isoDate(0),
    dueDate: isoDate(7),
    description: "",
    itemName: "",
    itemDescription: "",
    quantity: 1,
    rate: 0,
    itemUOM: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankSortCode: "",
  }));
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateInvoiceInput>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues,
  });

  async function onSubmit(values: CreateInvoiceInput) {
    try {
      await createInvoice(values);
      toast.success("Invoice created successfully");
      router.push(ROUTES.invoices);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Could not create invoice";
      toast.error(message);
    }
  }

  const err = (name: keyof CreateInvoiceInput) =>
    errors[name]?.message ? String(errors[name]?.message) : undefined;
  const invalid = (name: keyof CreateInvoiceInput) => Boolean(errors[name]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer</CardTitle>
          <CardDescription>Who the invoice is billed to.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field id="customerFirstName" label="First name" required error={err("customerFirstName")}>
            <Input id="customerFirstName" aria-invalid={invalid("customerFirstName")} {...register("customerFirstName")} />
          </Field>
          <Field id="customerLastName" label="Last name" required error={err("customerLastName")}>
            <Input id="customerLastName" aria-invalid={invalid("customerLastName")} {...register("customerLastName")} />
          </Field>
          <Field id="customerEmail" label="Email" required error={err("customerEmail")}>
            <Input id="customerEmail" type="email" placeholder="name@example.com" aria-invalid={invalid("customerEmail")} {...register("customerEmail")} />
          </Field>
          <Field id="customerMobile" label="Mobile" required error={err("customerMobile")}>
            <Input id="customerMobile" placeholder="+6597594971" aria-invalid={invalid("customerMobile")} {...register("customerMobile")} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice details</CardTitle>
          <CardDescription>Reference, currency and dates.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field id="invoiceNumber" label="Invoice number" required hint="Auto-generated — edit if needed." error={err("invoiceNumber")}>
            <Input id="invoiceNumber" aria-invalid={invalid("invoiceNumber")} {...register("invoiceNumber")} />
          </Field>
          <Field id="invoiceReference" label="Reference" optional error={err("invoiceReference")}>
            <Input id="invoiceReference" {...register("invoiceReference")} />
          </Field>
          <Field id="currency" label="Currency" required error={err("currency")}>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <div className="hidden sm:block" />
          <Field id="invoiceDate" label="Invoice date" required error={err("invoiceDate")}>
            <Input id="invoiceDate" type="date" aria-invalid={invalid("invoiceDate")} {...register("invoiceDate")} />
          </Field>
          <Field id="dueDate" label="Due date" required error={err("dueDate")}>
            <Input id="dueDate" type="date" aria-invalid={invalid("dueDate")} {...register("dueDate")} />
          </Field>
          <Field id="description" label="Description" optional className="sm:col-span-2" error={err("description")}>
            <Input id="description" {...register("description")} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Line item</CardTitle>
          <CardDescription>This invoice has a single line item.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field id="itemName" label="Item name" required error={err("itemName")}>
            <Input id="itemName" aria-invalid={invalid("itemName")} {...register("itemName")} />
          </Field>
          <Field id="itemUOM" label="Unit" optional hint="e.g. UNIT, KG, HOUR" error={err("itemUOM")}>
            <Input id="itemUOM" placeholder="UNIT" {...register("itemUOM")} />
          </Field>
          <Field id="quantity" label="Quantity" required error={err("quantity")}>
            <Input id="quantity" type="number" min={1} aria-invalid={invalid("quantity")} {...register("quantity", { valueAsNumber: true })} />
          </Field>
          <Field id="rate" label="Rate" required hint="Price per unit." error={err("rate")}>
            <Input id="rate" type="number" min={0} step="0.01" aria-invalid={invalid("rate")} {...register("rate", { valueAsNumber: true })} />
          </Field>
          <Field id="itemDescription" label="Item description" optional className="sm:col-span-2" error={err("itemDescription")}>
            <Input id="itemDescription" {...register("itemDescription")} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bank account</CardTitle>
          <CardDescription>Where payment should be sent.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field id="bankAccountName" label="Account name" required className="sm:col-span-2" error={err("bankAccountName")}>
            <Input id="bankAccountName" aria-invalid={invalid("bankAccountName")} {...register("bankAccountName")} />
          </Field>
          <Field id="bankAccountNumber" label="Account number" required error={err("bankAccountNumber")}>
            <Input id="bankAccountNumber" inputMode="numeric" aria-invalid={invalid("bankAccountNumber")} {...register("bankAccountNumber")} />
          </Field>
          <Field id="bankSortCode" label="Sort code" required hint="Format: 00-00-00" error={err("bankSortCode")}>
            <Input id="bankSortCode" placeholder="09-01-01" aria-invalid={invalid("bankSortCode")} {...register("bankSortCode")} />
          </Field>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push(ROUTES.invoices)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting ? "Creating…" : "Create invoice"}
        </Button>
      </div>
    </form>
  );
}
