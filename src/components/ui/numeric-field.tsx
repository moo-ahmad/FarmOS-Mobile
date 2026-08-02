import { TextField, type TextFieldProps } from './text-field';

export type NumericFieldProps = TextFieldProps;

/**
 * Numeric input — the workhorse of this data-entry app, so it defaults to the
 * decimal keypad. Pair with the decimal helpers (`toMoney` / `toQuantity`);
 * never parse its value as a JS number.
 */
export function NumericField({
  keyboardType = 'decimal-pad',
  inputMode = 'decimal',
  ...rest
}: NumericFieldProps) {
  return (
    <TextField keyboardType={keyboardType} inputMode={inputMode} {...rest} />
  );
}
