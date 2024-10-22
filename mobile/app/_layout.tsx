import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MainScreen from './index';
import ProfileScreen from './profile';
import SearchScreen from './search';

const Tab = createBottomTabNavigator();

export default function RootLayout() {
  return (
    <Tab.Navigator
      initialRouteName="index"  // Set Main as the default page
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'search') {
            iconName = focused ? 'search' : 'search-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="search" component={SearchScreen} options={{title: "Search"}}/>
      <Tab.Screen name="index" component={MainScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="profile" component={ProfileScreen} options={{ title: 'Profile'}} />
    </Tab.Navigator>
  );
}