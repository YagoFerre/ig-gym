import React from 'react'

import { Input as NaviteBaseInput, IInputProps, FormControl } from 'native-base'

interface Props extends IInputProps {
  errorMessage?: string | null
}

export function Input({ errorMessage = null, ...rest }: Props) {
  const isInvalid = !!errorMessage

  return (
    <FormControl isInvalid={isInvalid} mb={4}>
      <NaviteBaseInput
        bg="gray.700"
        h={14}
        px={4}
        borderWidth={0}
        fontSize="md"
        color="white"
        fontFamily="body"
        placeholderTextColor="gray.300"
        _focus={{
          bg: 'gray.700',
          borderWidth: 1,
          borderColor: 'green.500',
        }}
        isInvalid={isInvalid}
        _invalid={{
          borderWidth: 1,
          borderColor: 'red.500',
        }}
        {...rest}
      />

      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  )
}
