import React from 'react'

import { SignIn } from '@screens/SignIn'
import { SignUp } from '@screens/SignUp'

import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'

type AuthRoutesProps = {
  SignIn: undefined
  SignUp: undefined
}

export type AuthNavigatorRoutesProps =
  NativeStackNavigationProp<AuthRoutesProps>

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutesProps>()

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="SignIn" component={SignIn} />
      <Screen name="SignUp" component={SignUp} />
    </Navigator>
  )
}
