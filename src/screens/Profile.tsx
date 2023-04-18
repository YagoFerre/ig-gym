/* eslint-disable no-useless-return */
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base'

import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { Input } from '@components/Input'
import { Button } from '@components/Button'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState('https://github.com/YagoFerre.png')

  const toast = useToast()

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri, { size: true })

        if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500',
          })
        }

        setUserPhoto(photoSelected.assets[0].uri)
      }
    } catch (error: any) {
      throw new Error(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton w={33} h={33} rounded="full" startColor="gray.500" endColor="gray.400" />
          ) : (
            <UserPhoto source={{ uri: userPhoto }} size={33} />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Input bgColor="gray.600" placeholder="Nome" />
          <Input placeholder="E-mail" bgColor="gray.600" isDisabled />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" mb={2} fontSize="md" fontFamily="heading">
            Alterar senha
          </Heading>

          <Input bgColor="gray.600" placeholder="Senha atual" secureTextEntry />
          <Input bgColor="gray.600" placeholder="Nova senha" secureTextEntry />
          <Input bgColor="gray.600" placeholder="Confirme a nova senha" secureTextEntry />

          <Button title="Atualizar" mt={4} />
        </VStack>
      </ScrollView>
    </VStack>
  )
}
