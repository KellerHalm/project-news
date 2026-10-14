import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { finalStepSchema, phoneSchema, smsCodeSchema } from './auth.scheme';

export const useAuthPopupCases = () => {
  const [step, setStep] = React.useState<number>(1);

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' }
  });

  const codeForm = useForm<z.infer<typeof smsCodeSchema>>({
    resolver: zodResolver(smsCodeSchema),
    defaultValues: { code: '' }
  });

  const finalForm = useForm<z.infer<typeof finalStepSchema>>({
    resolver: zodResolver(finalStepSchema),
    defaultValues: { email: '', name: '' }
  });

  const nextStep = () => setStep(prev => (prev < 3 ? prev + 1 : prev));
  const reset = () => {
    setStep(1);
    phoneForm.reset();
    codeForm.reset();
    finalForm.reset();
  };

  return { step, setStep, nextStep, reset, phoneForm, codeForm, finalForm };
};
