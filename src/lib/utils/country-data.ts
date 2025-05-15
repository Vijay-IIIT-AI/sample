interface CountryOption {
  value: string;
  label: string;
  dialCode: string;
  code: string;
}

export const countries: CountryOption[] = [
  { value: 'IN', label: 'India', dialCode: '+91', code: 'IN' },
  { value: 'US', label: 'United States', dialCode: '+1', code: 'US' },
  { value: 'GB', label: 'United Kingdom', dialCode: '+44', code: 'GB' },
  { value: 'CA', label: 'Canada', dialCode: '+1', code: 'CA' },
  { value: 'AU', label: 'Australia', dialCode: '+61', code: 'AU' },
  { value: 'DE', label: 'Germany', dialCode: '+49', code: 'DE' },
  { value: 'FR', label: 'France', dialCode: '+33', code: 'FR' },
  { value: 'IT', label: 'Italy', dialCode: '+39', code: 'IT' },
  { value: 'ES', label: 'Spain', dialCode: '+34', code: 'ES' },
  { value: 'BR', label: 'Brazil', dialCode: '+55', code: 'BR' },
  { value: 'JP', label: 'Japan', dialCode: '+81', code: 'JP' },
  { value: 'KR', label: 'South Korea', dialCode: '+82', code: 'KR' },
  { value: 'CN', label: 'China', dialCode: '+86', code: 'CN' },
  { value: 'RU', label: 'Russia', dialCode: '+7', code: 'RU' },
  { value: 'ZA', label: 'South Africa', dialCode: '+27', code: 'ZA' },
  // Add more countries as needed
];

export const getCountryByValue = (value: string) => {
  return countries.find(country => country.value === value);
};

export const filterCountries = (inputValue: string) => {
  const lowerInput = inputValue.toLowerCase();
  return countries.filter(country =>
    country.label.toLowerCase().includes(lowerInput) ||
    country.dialCode.includes(inputValue) ||
    country.code.toLowerCase().includes(lowerInput)
  );
}; 