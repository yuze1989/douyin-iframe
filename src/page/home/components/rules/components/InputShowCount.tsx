/* eslint-disable react/require-default-props */
import { Input } from 'antd';
import React, { useEffect, useState } from 'react';

interface IProps {
  placeholder: string;
  maxLength?: number;
  // eslint-disable-next-line no-unused-vars
  onChange?: (val: string) => void; // 返回值没有类型，即返回值为空
  value?: string;
  style?: Object;
  disabled?: boolean;
  trim?: boolean;
}
const InputShowCount = (props: IProps) => {
  const {
    placeholder, maxLength, onChange, value, style, disabled = false, trim,
  } = props;
  const [inputValue, setInputValue] = useState<string | undefined>(value);
  const changeValue = (val: string) => {
    const temp = trim ? val.trim() : val;
    setInputValue(temp);
    onChange?.(temp);
  };
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  return (
    <Input
      disabled={disabled}
      style={{ border: '1px solid #DDDDDD', borderRadius: '2px', ...style }}
      placeholder={placeholder}
      maxLength={maxLength}
      value={inputValue}
      suffix={
        maxLength && (
          <span style={{ color: '#ccc' }}>
            {inputValue?.length || 0}
            /
            {maxLength}
          </span>
        )
      }
      onChange={(e) => changeValue(e.target.value)}
    />
  );
};

export default InputShowCount;
