import { Image, IImageProps } from 'native-base'

interface Props extends IImageProps {
  size: number
}

export function UserPhoto({ size, ...rest }: Props) {
  return (
    <Image
      w={size}
      h={size}
      alt="Foto do usuário"
      borderWidth={2}
      borderColor="gray.400"
      rounded="full"
      {...rest}
    />
  )
}
