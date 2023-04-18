import { useState } from 'react'
import { FlatList, HStack, VStack, Text } from 'native-base'

import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { HomeHeader } from '@components/HomeHeader'
import { Group } from '@components/Group'
import { ExerciseCard } from '@components/ExerciseCard'

export function Home() {
  const [groups, setGroups] = useState(['costas', 'bíceps', 'tríceps', 'ombro'])
  const [exercises, setExercises] = useState([
    'Puxada frontal',
    'Remada curvada',
    'Remada unilateral',
    'Levantamento terra',
  ])
  const [groupSelected, setGroupSelected] = useState('costas')

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails() {
    navigation.navigate('Exercise')
  }

  return (
    <VStack flex={1}>
      <HomeHeader />

      <HStack>
        <FlatList
          data={groups}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Group
              name={item}
              isActive={groupSelected.toUpperCase() === item.toUpperCase()}
              onPress={() => setGroupSelected(item)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          _contentContainerStyle={{ px: 8 }}
          my={10}
          maxH={10}
          minH={10}
        />
      </HStack>

      <VStack flex={1} px={8}>
        <HStack justifyContent="space-between" mb={5}>
          <Text color="gray.200" fontSize="md" flex={1}>
            Exercícios
          </Text>
          <Text color="gray.200" fontSize="sm">
            {exercises.length}
          </Text>
        </HStack>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <ExerciseCard onPress={handleOpenExerciseDetails} />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  )
}
