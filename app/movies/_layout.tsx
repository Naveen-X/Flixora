
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

const Stack = createSharedElementStackNavigator();

export default function MovieStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" component={require('./[id]').default} />
      <Stack.Screen name="play/[id]" component={require('./play/[id]').default} />
    </Stack.Navigator>
  );
}
