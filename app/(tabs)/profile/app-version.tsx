import { Text, View } from "react-native";
import * as Application from 'expo-application';
import { useEffect, useState } from 'react';

export default function AppVersion() {
  const [appVersion, setAppVersion] = useState('Loading...');

  useEffect(() => {
    const getVersion = async () => {
      const version = Application.nativeApplicationVersion || 'Unknown';
      setAppVersion(version);
    };
    getVersion();
  }, []);

  return (
    <View className="flex-1 bg-slate-950 justify-center items-center" style={{ backgroundColor: '#020617' }}>
      <Text className="text-white text-2xl mb-4">App Version</Text>
      <Text className="text-white text-xl">{appVersion}</Text>
    </View>
  );
}
