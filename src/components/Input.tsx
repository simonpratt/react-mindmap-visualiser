import React from 'react';
import styled, { css } from 'styled-components';

const INPUT_HEIGHT = 32;

export const InputStyles = css`
  outline: none;
  box-shadow: none;

  height: ${INPUT_HEIGHT}px;
  padding: 0 12px;
  scroll-margin-bottom: 100px;

  font-family: 'Roboto', sans-serif;
  font-size: 16px;

  color: #e2e2e2;
  background-color: #5e6167;

  border: 1px solid #565656;
  border-radius: 2px;

  &:hover {
    border: 1px solid #4a4949;
  }

  &:focus {
    border: 1px solid #4289de;
  }

  &::placeholder {
    color: #949494;
  }
`;

const StyledInput = styled.input`
  ${InputStyles}
`;

export interface InputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const Input = ({ value, onChange, placeholder }: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return <StyledInput value={value} onChange={handleChange} placeholder={placeholder} />;
};

export default Input;
