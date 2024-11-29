import { format } from 'date-fns-jalali';

export const convertToPersianDate = (date: Date) => {
  const dateValue = format(new Date(date), 'yyyy-MM-dd');
  const timeValue = format(new Date(date), 'HH:mm');

  return `${dateValue} - ${timeValue}`;
};
