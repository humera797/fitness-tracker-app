import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import UserDataScreen1 from './screens/UserDataScreen1';
import UserDataScreen2 from './screens/UserDataScreen2';
import HomeScreen from './screens/HomeScreen';
import WorkoutScreen from './screens/WorkoutScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="UserData1" component={UserDataScreen1} />
        <Stack.Screen name="UserData2" component={UserDataScreen2} />
        <Stack.Screen name="Home" component={HomeTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#655754',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarLabel: 'Home ' }} />
      <Tab.Screen name="Workout" component={WorkoutScreen}
        options={{ tabBarLabel: 'Workout ' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#C2B2AE',
    borderTopWidth: 0,
    height: 62,
    position: 'absolute',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});


