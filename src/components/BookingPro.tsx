'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Users,
  Mail,
  Phone,
  User,
  MessageSquare,
  CreditCard,
  Check,
  AlertCircle,
  Loader2,
  Shield,
  Star,
} from 'lucide-react';
import DatePicker from './DatePicker';

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  participants: number;
  notes: string;
}

interface BookingProProps {
  packageId: string;
  packageTitle: string;
  packagePrice: number;
  maxParticipants?: number;
  onSubmit: (data: BookingFormData) => Promise<void>;
  isSubmitting: boolean;
  error?: string;
}

const inputVariants = {
  focused: {
    scale: 1.02,
    transition: { type: 'spring' as const, stiffness: 300 },
  },
  unfocused: { scale: 1 },
};

const formSteps = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'booking', label: 'Booking Details', icon: Calendar },
  { id: 'payment', label: 'Payment', icon: CreditCard },
];

export default function BookingPro({
  packageId,
  packageTitle,
  packagePrice,
  maxParticipants = 20,
  onSubmit,
  isSubmitting,
  error,
}: BookingProProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    participants: 1,
    notes: '',
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const totalPrice = packagePrice * formData.participants;

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      const newValue = type === 'number' ? parseInt(value) || 1 : value;

      setFormData(prev => ({
        ...prev,
        [name]: name === 'participants' ? parseInt(value) || 1 : newValue,
      }));

      // Clear validation error when user starts typing
      if (validationErrors[name as keyof BookingFormData]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name as keyof BookingFormData];
          return newErrors;
        });
      }
    },
    [validationErrors]
  );

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.firstName.trim())
        errors.firstName = 'First name is required';
      if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
      if (!formData.email.trim()) errors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email';
      }
      if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    }

    if (step === 1) {
      if (!formData.date) errors.date = 'Please select a date';
      const participants = Number(formData.participants);
      if (participants < 1)
        errors.participants = 'At least 1 participant required';
      if (participants > maxParticipants) {
        errors.participants = `Maximum ${maxParticipants} participants allowed`;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(0) && validateStep(1)) {
      await onSubmit(formData);
    }
  };

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Progress Steps */}
      <div className='mb-12'>
        <div className='flex items-center justify-center'>
          {formSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.id} className='flex items-center'>
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted
                      ? '#10b981'
                      : isActive
                        ? '#3b82f6'
                        : '#6b7280',
                    scale: isActive ? 1.1 : 1,
                  }}
                  className='flex items-center justify-center w-12 h-12 rounded-full text-white font-bold relative'
                >
                  {isCompleted ? (
                    <Check className='w-6 h-6' />
                  ) : (
                    <Icon className='w-6 h-6' />
                  )}

                  {isActive && (
                    <motion.div
                      className='absolute inset-0 rounded-full border-4 border-blue-300'
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                <div className='ml-3 mr-8'>
                  <p
                    className={`text-sm font-semibold ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
                  >
                    Step {index + 1}
                  </p>
                  <p
                    className={`text-lg ${isActive ? 'text-gray-900' : 'text-gray-500'}`}
                  >
                    {step.label}
                  </p>
                </div>

                {index < formSteps.length - 1 && (
                  <div
                    className={`w-24 h-1 mx-4 rounded ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <motion.div
        className='bg-white rounded-3xl shadow-2xl p-8 md:p-12'
        layout
      >
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode='wait'>
            {/* Step 1: Personal Information */}
            {currentStep === 0 && (
              <motion.div
                key='personal'
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className='space-y-6'
              >
                <div className='text-center mb-8'>
                  <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                    Personal Information
                  </h2>
                  <p className='text-gray-600'>
                    Let us know who&apos;s joining the adventure
                  </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <motion.div
                    variants={inputVariants}
                    animate={
                      focusedField === 'firstName' ? 'focused' : 'unfocused'
                    }
                  >
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      <User className='w-4 h-4 inline mr-2' />
                      First Name *
                    </label>
                    <input
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                        validationErrors.firstName
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                      } focus:ring-4`}
                      placeholder='Enter your first name'
                    />
                    {validationErrors.firstName && (
                      <p className='text-red-500 text-sm mt-1 flex items-center'>
                        <AlertCircle className='w-4 h-4 mr-1' />
                        {validationErrors.firstName}
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    variants={inputVariants}
                    animate={
                      focusedField === 'lastName' ? 'focused' : 'unfocused'
                    }
                  >
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      <User className='w-4 h-4 inline mr-2' />
                      Last Name *
                    </label>
                    <input
                      type='text'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                        validationErrors.lastName
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                      } focus:ring-4`}
                      placeholder='Enter your last name'
                    />
                    {validationErrors.lastName && (
                      <p className='text-red-500 text-sm mt-1 flex items-center'>
                        <AlertCircle className='w-4 h-4 mr-1' />
                        {validationErrors.lastName}
                      </p>
                    )}
                  </motion.div>
                </div>

                <motion.div
                  variants={inputVariants}
                  animate={focusedField === 'email' ? 'focused' : 'unfocused'}
                >
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    <Mail className='w-4 h-4 inline mr-2' />
                    Email Address *
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                      validationErrors.email
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    } focus:ring-4`}
                    placeholder='your.email@example.com'
                  />
                  {validationErrors.email && (
                    <p className='text-red-500 text-sm mt-1 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {validationErrors.email}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  variants={inputVariants}
                  animate={focusedField === 'phone' ? 'focused' : 'unfocused'}
                >
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    <Phone className='w-4 h-4 inline mr-2' />
                    Phone Number *
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                      validationErrors.phone
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    } focus:ring-4`}
                    placeholder='+33 6 12 34 56 78'
                  />
                  {validationErrors.phone && (
                    <p className='text-red-500 text-sm mt-1 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {validationErrors.phone}
                    </p>
                  )}
                  <p className='text-xs text-gray-500 mt-1'>
                    Include country code (e.g., +33, +212, +966)
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Booking Details */}
            {currentStep === 1 && (
              <motion.div
                key='booking'
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className='space-y-6'
              >
                <div className='text-center mb-8'>
                  <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                    Booking Details
                  </h2>
                  <p className='text-gray-600'>
                    When would you like to experience the magic of Dakhla?
                  </p>
                </div>

                <motion.div
                  variants={inputVariants}
                  animate={focusedField === 'date' ? 'focused' : 'unfocused'}
                >
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    <Calendar className='w-4 h-4 inline mr-2' />
                    Preferred Date *
                  </label>
                  <DatePicker
                    selectedDate={formData.date}
                    onDateChange={date =>
                      setFormData(prev => ({ ...prev, date }))
                    }
                    participants={formData.participants}
                  />
                  {validationErrors.date && (
                    <p className='text-red-500 text-sm mt-1 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {validationErrors.date}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  variants={inputVariants}
                  animate={
                    focusedField === 'participants' ? 'focused' : 'unfocused'
                  }
                >
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    <Users className='w-4 h-4 inline mr-2' />
                    Number of Participants *
                  </label>
                  <select
                    name='participants'
                    value={formData.participants}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('participants')}
                    onBlur={() => setFocusedField(null)}
                    aria-label='Select number of participants'
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                      validationErrors.participants
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    } focus:ring-4`}
                  >
                    {Array.from(
                      { length: maxParticipants },
                      (_, i) => i + 1
                    ).map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'person' : 'people'}
                      </option>
                    ))}
                  </select>
                  {validationErrors.participants && (
                    <p className='text-red-500 text-sm mt-1 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {validationErrors.participants}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  variants={inputVariants}
                  animate={focusedField === 'notes' ? 'focused' : 'unfocused'}
                >
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    <MessageSquare className='w-4 h-4 inline mr-2' />
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name='notes'
                    value={formData.notes}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('notes')}
                    onBlur={() => setFocusedField(null)}
                    rows={4}
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-200 resize-none'
                    placeholder='Any special requests, dietary requirements, or questions...'
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Step 3: Payment Summary */}
            {currentStep === 2 && (
              <motion.div
                key='payment'
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className='space-y-8'
              >
                <div className='text-center mb-8'>
                  <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                    Booking Summary
                  </h2>
                  <p className='text-gray-600'>
                    Review your booking details before payment
                  </p>
                </div>

                {/* Booking Summary */}
                <div className='bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6'>
                  <h3 className='text-xl font-bold text-gray-900 mb-4'>
                    {packageTitle}
                  </h3>

                  <div className='space-y-3 text-gray-700'>
                    <div className='flex justify-between'>
                      <span>Name:</span>
                      <span className='font-semibold'>
                        {formData.firstName} {formData.lastName}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Email:</span>
                      <span className='font-semibold'>{formData.email}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Phone:</span>
                      <span className='font-semibold'>{formData.phone}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Date:</span>
                      <span className='font-semibold'>{formData.date}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Participants:</span>
                      <span className='font-semibold'>
                        {formData.participants}{' '}
                        {formData.participants === 1 ? 'person' : 'people'}
                      </span>
                    </div>

                    <div className='border-t pt-3 mt-4'>
                      <div className='flex justify-between text-lg font-bold'>
                        <span>Total Amount:</span>
                        <span className='text-blue-600'>
                          €{totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className='flex items-center justify-center gap-3 text-gray-600'>
                  <Shield className='w-5 h-5 text-green-600' />
                  <span className='text-sm'>
                    Secure payment with SSL encryption
                  </span>
                  <Star className='w-5 h-5 text-yellow-500' />
                </div>

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-red-50 border border-red-200 rounded-xl p-4'
                  >
                    <div className='flex items-center gap-3 text-red-700'>
                      <AlertCircle className='w-5 h-5 flex-shrink-0' />
                      <p>{error}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className='flex justify-between items-center mt-8 pt-6 border-t'>
            <motion.button
              type='button'
              onClick={prevStep}
              disabled={currentStep === 0}
              whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
              whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Previous
            </motion.button>

            {currentStep < 2 ? (
              <motion.button
                type='button'
                onClick={nextStep}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200'
              >
                Continue
              </motion.button>
            ) : (
              <motion.button
                type='submit'
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                className='px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='w-5 h-5 animate-spin' />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className='w-5 h-5' />
                    Complete Booking
                  </>
                )}
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
