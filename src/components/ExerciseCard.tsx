import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { HStack, Heading, Image, Text, VStack, Icon } from 'native-base'
import { Entypo } from '@expo/vector-icons'

interface Props extends TouchableOpacityProps {}

export function ExerciseCard({ ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack alignItems="center" bg="gray.500" p={2} pr={4} rounded="md" mb={3}>
        <Image
          source={{
            uri: 'https://www.fiqueinforma.com/wp-content/uploads/2008/12/puxadas.jpg',
          }}
          alt="Imagem do exercício"
          w={16}
          h={16}
          mr={4}
          rounded="md"
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading color="white" fontSize="lg" fontFamily="heading">
            Puxada frontal
          </Heading>
          <Text color="gray.200" fontSize="sm" mt={1} numberOfLines={2}>
            3 séries x 12 repetições
          </Text>
        </VStack>

        <Icon as={Entypo} name="chevron-thin-right" color="gray.300" />
      </HStack>
    </TouchableOpacity>
  )
}
