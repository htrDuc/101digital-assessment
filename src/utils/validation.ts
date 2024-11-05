import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const invoiceSchema = z.object({
  bankAccount: z.object({
    bankId: z.string().optional(),
    sortCode: z.string().min(1, 'Sort code is required'),
    accountNumber: z.string().min(1, 'Account number is required'),
    accountName: z.string().min(1, 'Account name is required'),
  }),
  customer: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    contact: z.object({
      email: z.string().email('Invalid email address'),
      mobileNumber: z.string().min(1, 'Mobile number is required'),
    }),
    addresses: z
      .array(
        z.object({
          premise: z.string().min(1, 'Premise is required'),
          countryCode: z
            .string()
            .min(2, 'Country code is required')
            .max(3, 'Country code should be 2-3 characters'),
          postcode: z.string().min(1, 'Postcode is required'),
          county: z.string().min(1, 'County is required'),
          city: z.string().min(1, 'City is required'),
          addressType: z.string().min(1, 'Address type is required'),
        }),
      )
      .min(1, 'At least one address is required'),
  }),
  documents: z
    .array(
      z.object({
        documentId: z.string().optional(),
        documentName: z.string().optional(),
        documentUrl: z.string().url('Invalid document URL').optional(),
      }),
    )
    .optional(),
  invoiceReference: z.string().min(1, 'Invoice reference is required'),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  currency: z.string().min(1, 'Currency is required'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  description: z.string().min(1, 'Description is required'),
  customFields: z
    .array(
      z.object({
        key: z.string().min(1, 'Custom field key is required'),
        value: z.string().min(1, 'Custom field value is required'),
      }),
    )
    .optional(),
  extensions: z
    .array(
      z.object({
        addDeduct: z.enum(['ADD', 'DEDUCT']),
        value: z.number().min(0, 'Extension value must be a positive number'),
        type: z.enum(['FIXED_VALUE', 'PERCENTAGE']),
        name: z.string().min(1, 'Extension name is required'),
      }),
    )
    .optional(),
  items: z
    .array(
      z.object({
        itemReference: z.string().optional(),
        description: z.string().min(1, 'Item description is required'),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
        rate: z.number().min(0, 'Rate must be a positive number'),
        itemName: z.string().min(1, 'Item name is required'),
        itemUOM: z.string().min(1, 'Unit of Measure is required'),
        customFields: z
          .array(
            z.object({
              key: z.string().min(1, 'Custom field key is required'),
              value: z.string().min(1, 'Custom field value is required'),
            }),
          )
          .optional(),
        extensions: z
          .array(
            z.object({
              addDeduct: z.enum(['ADD', 'DEDUCT']),
              value: z
                .number()
                .min(0, 'Extension value must be a positive number'),
              type: z.enum(['FIXED_VALUE', 'PERCENTAGE']),
              name: z.string().min(1, 'Extension name is required'),
            }),
          )
          .optional(),
      }),
    )
    .min(1, 'At least one item is required'),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
