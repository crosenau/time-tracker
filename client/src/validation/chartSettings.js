import isEmpty from 'is-empty';

export default function validateChartSettings(data) {
  const errors = {};

  if (!data.startDate) {
    errors.dateRange = 'From date is required';
  } else if (!data.endDate) {
    errors.dateRange = 'To date is required';
  } else if (data.startDate > data.endDate) {
    errors.dateRange = 'From date must be eariler then To'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};