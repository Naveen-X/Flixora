import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CustomHeader({ title }) {
  const router = useRouter();

  return (
    <View style={{ height: 50, backgroundColor: 'black', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
      <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
        <Feather name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>{title}</Text>
    </View>
  );
}
