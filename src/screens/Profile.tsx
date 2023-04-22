/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-useless-return */
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base'

import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { Input } from '@components/Input'
import { Button } from '@components/Button'

import userPhotoDefault from '@assets/userPhotoDefault.png'

import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'

interface ProfileDataProps {
  name: string
  email: string
  password: string
  old_password: string
  password_confirm: string
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  password: yup
    .string()
    .min(6, 'A senha deve ter ao menos 6 dígitos')
    .nullable()
    .transform((value) => (!!value ? value : null)),
  password_confirm: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref('password'), null], 'A confirmação não confere.')
    .when('password', {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required('Informe a confirmação da senha.')
          .transform((value) => (!!value ? value : null)),
    }),
})

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const { user, updateUserProfile } = useAuth()

  const toast = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  })

  async function handleUserPhotoSelect() {
    try {
      setPhotoIsLoading(true)
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

        const fileExtension = photoSelected.assets[0].uri.split('.').pop()

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar

        await updateUserProfile(userUpdated)

        toast.show({
          title: 'Foto atualizada.',
          placement: 'top',
          bgColor: 'green.500',
        })
      }
    } catch (error: any) {
      throw new Error(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function handleProfileUpdate(data: ProfileDataProps) {
    try {
      setIsUpdating(true)

      const userUpdated = user
      userUpdated.name = data.name

      await api.put('/users', data)

      await updateUserProfile(userUpdated)

      toast.show({
        title: 'Os dados foram atualizados.',
        placement: 'top',
        bgColor: 'green.700',
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar os dados. Tente novamente mais tarde'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsUpdating(false)
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
            <UserPhoto
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : userPhotoDefault
              }
              size={33}
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                bgColor="gray.600"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
            name="name"
          />

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                bgColor="gray.600"
                placeholder="E-mail"
                isDisabled
                onChangeText={onChange}
                value={value}
              />
            )}
            name="email"
          />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" mb={2} fontSize="md" fontFamily="heading">
            Alterar senha
          </Heading>

          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bgColor="gray.600"
                placeholder="Senha atual"
                secureTextEntry
                onChangeText={onChange}
              />
            )}
            name="old_password"
          />

          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bgColor="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
            name="password"
          />

          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bgColor="gray.600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password_confirm?.message}
              />
            )}
            name="password_confirm"
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </VStack>
      </ScrollView>
    </VStack>
  )
}
