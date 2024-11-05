import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useInvoiceContext } from '@/contexts/InvoiceContext';
import { useInvoice } from '@/hooks/useInvoice';
import { useToast } from '@/hooks/useToast';
import { InvoiceFormData, invoiceSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateInvoiceDialog({
  isOpen,
  onClose,
}: CreateInvoiceDialogProps) {
  const { toast } = useToast();
  const { addInvoice } = useInvoice();
  const { refreshInvoices } = useInvoiceContext();
  const [showAlert, setShowAlert] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    if (isOpen) {
      setIsDirty(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const subscription = form.watch(() => setIsDirty(form.formState.isDirty));
    return () => subscription.unsubscribe();
  }, [form]);

  const handleClose = () => {
    if (isDirty) {
      setShowAlert(true);
    } else {
      onClose();
      reset();
    }
  };

  const handleConfirmClose = () => {
    setShowAlert(false);
    onClose();
    reset();
  };

  const { fields: customFields, append: appendCustomField } = useFieldArray({
    control,
    name: 'customFields',
  });

  const { fields: extensions, append: appendExtension } = useFieldArray({
    control,
    name: 'extensions',
  });

  const { fields: items, append: appendItem } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      await addInvoice(data);
      toast({
        title: 'Success',
        description: 'Invoice created successfully',
      });
      refreshInvoices();
      onClose();
      reset();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to create invoice. Please try again.',
        variant: 'destructive',
      });
    }
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-5xl h-[900px] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              <span className="text-xl font-bold">Create Invoice</span>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Controller
                    name="invoiceNumber"
                    control={control}
                    render={({ field }) => (
                      <Input id="invoiceNumber" {...field} />
                    )}
                  />
                  {errors.invoiceNumber && (
                    <p className="text-sm text-red-500">
                      {errors.invoiceNumber.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceReference">Invoice Reference</Label>
                  <Controller
                    name="invoiceReference"
                    control={control}
                    render={({ field }) => (
                      <Input id="invoiceReference" {...field} />
                    )}
                  />
                  {errors.invoiceReference && (
                    <p className="text-sm text-red-500">
                      {errors.invoiceReference.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.currency && (
                    <p className="text-sm text-red-500">
                      {errors.currency.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">Invoice Date</Label>
                  <Controller
                    name="invoiceDate"
                    control={control}
                    render={({ field }) => (
                      <Input id="invoiceDate" type="date" {...field} />
                    )}
                  />
                  {errors.invoiceDate && (
                    <p className="text-sm text-red-500">
                      {errors.invoiceDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Controller
                    name="dueDate"
                    control={control}
                    render={({ field }) => (
                      <Input id="dueDate" type="date" {...field} />
                    )}
                  />
                  {errors.dueDate && (
                    <p className="text-sm text-red-500">
                      {errors.dueDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea id="description" {...field} />
                  )}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer.firstName">First Name</Label>
                    <Controller
                      name="customer.firstName"
                      control={control}
                      render={({ field }) => (
                        <Input id="customer.firstName" {...field} />
                      )}
                    />
                    {errors.customer?.firstName && (
                      <p className="text-sm text-red-500">
                        {errors.customer.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer.lastName">Last Name</Label>
                    <Controller
                      name="customer.lastName"
                      control={control}
                      render={({ field }) => (
                        <Input id="customer.lastName" {...field} />
                      )}
                    />
                    {errors.customer?.lastName && (
                      <p className="text-sm text-red-500">
                        {errors.customer.lastName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer.contact.email">Email</Label>
                    <Controller
                      name="customer.contact.email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="customer.contact.email"
                          type="email"
                          {...field}
                        />
                      )}
                    />
                    {errors.customer?.contact?.email && (
                      <p className="text-sm text-red-500">
                        {errors.customer.contact.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer.contact.mobileNumber">
                      Mobile Number
                    </Label>
                    <Controller
                      name="customer.contact.mobileNumber"
                      control={control}
                      render={({ field }) => (
                        <Input id="customer.contact.mobileNumber" {...field} />
                      )}
                    />
                    {errors.customer?.contact?.mobileNumber && (
                      <p className="text-sm text-red-500">
                        {errors.customer.contact.mobileNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer.addresses.0.premise">
                      Premise
                    </Label>
                    <Controller
                      name="customer.addresses.0.premise"
                      control={control}
                      render={({ field }) => (
                        <Input id="customer.addresses.0.premise" {...field} />
                      )}
                    />
                    {errors.customer?.addresses?.[0]?.premise && (
                      <p className="text-sm text-red-500">
                        {errors.customer.addresses[0].premise.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer.addresses.0.countryCode">
                      Country Code
                    </Label>
                    <Controller
                      name="customer.addresses.0.countryCode"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="customer.addresses.0.countryCode"
                          {...field}
                        />
                      )}
                    />
                    {errors.customer?.addresses?.[0]?.countryCode && (
                      <p className="text-sm text-red-500">
                        {errors.customer.addresses[0].countryCode.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer.addresses.0.postcode">
                      Postcode
                    </Label>
                    <Controller
                      name="customer.addresses.0.postcode"
                      control={control}
                      render={({ field }) => (
                        <Input id="customer.addresses.0.postcode" {...field} />
                      )}
                    />
                    {errors.customer?.addresses?.[0]?.postcode && (
                      <p className="text-sm text-red-500">
                        {errors.customer.addresses[0].postcode.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer.addresses.0.county">County</Label>
                    <Controller
                      name="customer.addresses.0.county"
                      control={control}
                      render={({ field }) => (
                        <Input id="customer.addresses.0.county" {...field} />
                      )}
                    />
                    {errors.customer?.addresses?.[0]?.county && (
                      <p className="text-sm text-red-500">
                        {errors.customer.addresses[0].county.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer.addresses.0.city">City</Label>
                    <Controller
                      name="customer.addresses.0.city"
                      control={control}
                      render={({ field }) => (
                        <Input id="customer.addresses.0.city" {...field} />
                      )}
                    />
                    {errors.customer?.addresses?.[0]?.city && (
                      <p className="text-sm text-red-500">
                        {errors.customer.addresses[0].city.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Bank Account Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount.bankId">Bank ID</Label>
                    <Controller
                      name="bankAccount.bankId"
                      control={control}
                      render={({ field }) => (
                        <Input id="bankAccount.bankId" {...field} />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount.sortCode">Sort Code</Label>
                    <Controller
                      name="bankAccount.sortCode"
                      control={control}
                      render={({ field }) => (
                        <Input id="bankAccount.sortCode" {...field} />
                      )}
                    />
                    {errors.bankAccount?.sortCode && (
                      <p className="text-sm text-red-500">
                        {errors.bankAccount.sortCode.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount.accountNumber">
                      Account Number
                    </Label>
                    <Controller
                      name="bankAccount.accountNumber"
                      control={control}
                      render={({ field }) => (
                        <Input id="bankAccount.accountNumber" {...field} />
                      )}
                    />
                    {errors.bankAccount?.accountNumber && (
                      <p className="text-sm text-red-500">
                        {errors.bankAccount.accountNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount.accountName">
                      Account Name
                    </Label>
                    <Controller
                      name="bankAccount.accountName"
                      control={control}
                      render={({ field }) => (
                        <Input id="bankAccount.accountName" {...field} />
                      )}
                    />
                    {errors.bankAccount?.accountName && (
                      <p className="text-sm text-red-500">
                        {errors.bankAccount.accountName.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Items</h3>
                {items.map((item, index) => (
                  <div key={item.id} className="space-y-4 p-4 border rounded">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.itemName`}>
                          Item Name
                        </Label>
                        <Controller
                          name={`items.${index}.itemName`}
                          control={control}
                          render={({ field }) => <Input {...field} />}
                        />
                        {errors.items?.[index]?.itemName && (
                          <p className="text-sm text-red-500">
                            {errors.items[index]?.itemName?.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.itemReference`}>
                          Item Reference
                        </Label>
                        <Controller
                          name={`items.${index}.itemReference`}
                          control={control}
                          render={({ field }) => <Input {...field} />}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.description`}>
                          Description
                        </Label>
                        <Controller
                          name={`items.${index}.description`}
                          control={control}
                          render={({ field }) => <Input {...field} />}
                        />
                        {errors.items?.[index]?.description && (
                          <p className="text-sm text-red-500">
                            {errors.items[index]?.description?.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.quantity`}>
                          Quantity
                        </Label>
                        <Controller
                          name={`items.${index}.quantity`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          )}
                        />
                        {errors.items?.[index]?.quantity && (
                          <p className="text-sm text-red-500">
                            {errors.items[index]?.quantity?.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.rate`}>Rate</Label>
                        <Controller
                          name={`items.${index}.rate`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          )}
                        />
                        {errors.items?.[index]?.rate && (
                          <p className="text-sm text-red-500">
                            {errors.items[index]?.rate?.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.itemUOM`}>
                          Unit of Measure
                        </Label>
                        <Controller
                          name={`items.${index}.itemUOM`}
                          control={control}
                          render={({ field }) => <Input {...field} />}
                        />
                        {errors.items?.[index]?.itemUOM && (
                          <p className="text-sm text-red-500">
                            {errors.items[index]?.itemUOM?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendItem({
                      itemReference: '',
                      description: '',
                      quantity: 1,
                      rate: 0,
                      itemName: '',
                      itemUOM: '',
                      customFields: [],
                      extensions: [],
                    })
                  }
                >
                  Add Item
                </Button>
              </div>

              {/* Custom Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Custom Fields</h3>
                {customFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-2 gap-4">
                    <Controller
                      name={`customFields.${index}.key`}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Custom Field Key" />
                      )}
                    />
                    <Controller
                      name={`customFields.${index}.value`}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Custom Field Value" />
                      )}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendCustomField({ key: '', value: '' })}
                >
                  Add Custom Field
                </Button>
              </div>

              {/* Extensions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Extensions</h3>
                {extensions.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-4 gap-4">
                    <Controller
                      name={`extensions.${index}.addDeduct`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="ADD or DEDUCT" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADD">ADD</SelectItem>
                            <SelectItem value="DEDUCT">DEDUCT</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Controller
                      name={`extensions.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FIXED_VALUE">
                              FIXED_VALUE
                            </SelectItem>
                            <SelectItem value="PERCENTAGE">
                              PERCENTAGE
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Controller
                      name={`extensions.${index}.value`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          step="0.01"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          value={field.value || ''}
                          placeholder="Value"
                        />
                      )}
                    />
                    <Controller
                      name={`extensions.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Extension Name" />
                      )}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendExtension({
                      addDeduct: 'ADD',
                      type: 'FIXED_VALUE',
                      value: 0,
                      name: '',
                    })
                  }
                >
                  Add Extension
                </Button>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit">Create Invoice</Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              If you close this form, all unsaved changes will be lost. Are you
              sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
