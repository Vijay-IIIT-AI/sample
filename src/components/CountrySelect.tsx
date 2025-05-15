import React from 'react';
import Select, { components, OptionProps, SingleValueProps } from 'react-select';
import Flag from 'react-world-flags';
import { countries } from '@/lib/utils/country-data';

interface CountryOption {
  value: string;
  label: string;
  dialCode: string;
  code: string;
}

interface CountrySelectProps {
  value: CountryOption | null;
  onChange: (value: CountryOption | null) => void;
  className?: string;
}

const Option = ({ children, ...props }: OptionProps<CountryOption>) => {
  const country = props.data;

  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        <div className="w-6 h-4 relative overflow-hidden rounded-sm">
          <Flag code={country.code} fallback={<span>{country.code}</span>} />
        </div>
        <span>{country.label}</span>
        <span className="text-gray-500 ml-auto">{country.dialCode}</span>
      </div>
    </components.Option>
  );
};

const SingleValue = ({ children, ...props }: SingleValueProps<CountryOption>) => {
  const country = props.data;

  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        <div className="w-6 h-4 relative overflow-hidden rounded-sm">
          <Flag code={country.code} fallback={<span>{country.code}</span>} />
        </div>
        <span>{country.label}</span>
        <span className="text-gray-500 ml-2">{country.dialCode}</span>
      </div>
    </components.SingleValue>
  );
};

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange, className }) => {
  return (
    <Select<CountryOption>
      options={countries}
      value={value}
      onChange={onChange}
      components={{ Option, SingleValue }}
      className={className}
      classNamePrefix="country-select"
      placeholder="Select country"
      isClearable={false}
      filterOption={(option, input) => {
        if (!input) return true;
        const searchStr = input.toLowerCase();
        return (
          option.data.label.toLowerCase().includes(searchStr) ||
          option.data.dialCode.includes(searchStr) ||
          option.data.code.toLowerCase().includes(searchStr)
        );
      }}
      styles={{
        control: (base) => ({
          ...base,
          padding: '2px',
        }),
        option: (base) => ({
          ...base,
          padding: '8px 12px',
        }),
      }}
    />
  );
};

export default CountrySelect; 