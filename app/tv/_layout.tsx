import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

const Stack = createSharedElementStackNavigator();

export default function TVLayout() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="./[id]" component={require('./[id]').default} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
