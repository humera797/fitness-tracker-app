import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WelcomeScreen from './screens/WelcomeScreen';
import SignupScreen from './screens/SignupScreen';
import UserDataScreen1 from './screens/UserDataScreen1';
import UserDataScreen2 from './screens/UserDataScreen2';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import FiltersScreen from './screens/FiltersScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import ExerciseListScreen from './screens/ExerciseListScreen';
import DetailScreen from './screens/DetailScreen';
import ActivityScreen from './screens/ActivityScreen';
import FavouritesScreen from './screens/FavouritesScreen';
import HistoryScreen from './screens/HistoryScreen';
import WorkoutPlanScreen from './screens/WorkoutPlanScreen';

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
        <Stack.Screen name="Filter" component={FiltersScreen} />
        <Stack.Screen name="ExerciseList" component={ExerciseListScreen} />
        <Stack.Screen name="DetailScreen" component={DetailScreen} />
        <Stack.Screen name="Activity" component={ActivityScreen} />
        <Stack.Screen name="Favourites" component={FavouritesScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="WorkoutPlan" component={WorkoutPlanScreen} />
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
      <Tab.Screen name="User Profile" component={UserProfileScreen}
        options={{ tabBarLabel: 'Profile ' }} />
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


