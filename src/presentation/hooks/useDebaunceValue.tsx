/* eslint-disable prettier/prettier */
import {useEffect, useState} from 'react';

export const useDebaunceValue = (input: string = '', time: number = 500) => {
  const [debauncedValue, setDebouncedValue] = useState(input);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(input);
    }, time);

    return () => {
      clearTimeout(timeout);
    };
  }, [input]);
  return debauncedValue;
};
