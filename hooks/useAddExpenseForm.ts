import { useState } from "react";
import type { AddExpenseForm } from "../types";

interface FormErrors {
  amount?: string;
  category?: string;
  description?: string;
}

export const useAddExpenseForm = () => {
  const [form, setForm] = useState<AddExpenseForm>({
    amount: "",
    category: "",
    description: "",
    photoUri: undefined,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (field: keyof AddExpenseForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const setPhoto = (uri: string) => {
    setForm((prev) => ({ ...prev, photoUri: uri }));
  };

  const removePhoto = () => {
    setForm((prev) => ({ ...prev, photoUri: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.amount || parseFloat(form.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!form.category) {
      newErrors.category = "Please select a category";
    }

    if (!form.description.trim()) {
      newErrors.description = "Please enter a description";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({ amount: "", category: "", description: "", photoUri: undefined });
    setErrors({});
  };

  return {
    form,
    errors,
    updateField,
    setPhoto,
    removePhoto,
    validateForm,
    resetForm,
  };
};
