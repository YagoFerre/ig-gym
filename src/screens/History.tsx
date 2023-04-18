import { useState } from 'react'
import { Heading, VStack, SectionList, Text } from 'native-base'

import { ScreenHeader } from '@components/ScreenHeader'
import { HistoryCard } from '@components/HistoryCard'

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: '16.04.23',
      data: ['Puxada frontal', 'Remada Unilateral'],
    },
    {
      title: '15.04.23',
      data: ['Puxada frontal'],
    },
  ])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      <SectionList
        px={8}
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <HistoryCard />}
        renderSectionHeader={({ section: { title } }) => (
          <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
            {title}
          </Heading>
        )}
        contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Não há exercícios registrados ainda.{'\n'} Vamos fazer exercícios hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}
