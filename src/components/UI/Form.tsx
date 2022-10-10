import { zodResolver } from '@hookform/resolvers/zod';
import type { ComponentProps, FC } from 'react';
import type { FieldValues, SubmitHandler, UseFormProps, UseFormReturn } from 'react-hook-form';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import type { TypeOf, ZodSchema } from 'zod';

interface UseZodFormProps<T extends ZodSchema<FieldValues>> extends UseFormProps<TypeOf<T>> {
  schema: T;
}

export const useZodForm = <T extends ZodSchema<FieldValues>>({
  schema,
  ...formConfig
}: UseZodFormProps<T>) => {
  return useForm({
    ...formConfig,
    resolver: zodResolver(schema)
  });
};

interface FieldErrorProps {
  name?: string;
}

export const FieldError: FC<FieldErrorProps> = ({ name }) => {
  const {
    formState: { errors }
  } = useFormContext();

  if (!name) {
    return null;
  }

  const error = errors[name];

  if (!error) {
    return null;
  }

  return <div className="mt-1 text-sm font-bold text-red-500">{error.message as any}</div>;
};

interface Props<T extends FieldValues = Record<string, unknown>>
  extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  className?: string;
}

export const Form = <T extends FieldValues>({ form, onSubmit, children, className = '' }: Props<T>) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset className={`flex flex-col ${className}`} disabled={form.formState.isSubmitting}>
          {children}
        </fieldset>
      </form>
    </FormProvider>
  );
};
