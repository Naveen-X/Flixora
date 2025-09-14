import { Feather } from "@expo/vector-icons";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Developers() {
  const developers = [
    { id: '1', name: 'Naveen xD', role: 'Lead Developer', github: 'https://github.com/Naveen-X' },
    { id: '2', name: 'Srishanth', role: 'UI/UX Designer', github: 'https://github.com/AikaSrishanth' },
    { id: '3', name: 'Aditya Valmiki', role: 'Backend Engineer', github: 'https://github.com/adhityavalmiki' },
    { id: '4', name: 'Nithin Kumar', role: 'Team Lead', github: 'https://github.com/' },
    { id: '5', name: 'Yogeswararao', role: 'Assistant Lead', github: 'https://github.com/' },
    { id: '6', name: 'Shanmukh', role: 'Assisssssssstant Lead', github: 'https://github.com/' },
    
  ];

  const handleGithubPress = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView className="flex-1 bg-black p-4">
      <Text className="text-white text-3xl font-bold mb-6">Our Team</Text>

      {developers.map((developer) => (
        <View key={developer.id} className="bg-neutral-800 rounded-lg p-4 mb-4 flex-row items-center">
          <View className="flex-1">
            <Text className="text-white text-xl font-semibold">{developer.name}</Text>
            <Text className="text-gray-400 text-base">{developer.role}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleGithubPress(developer.github)}
            className="flex-row items-center p-2 rounded-lg bg-gray-700"
          >
            <Feather name="github" size={20} color="#FFFFFF" className="mr-2" />
            <Text className="text-white text-base">GitHub</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View className="bg-neutral-800 rounded-lg p-4 mt-4">
        <Text className="text-white text-xl font-semibold mb-2">Want to contribute?</Text>
        {/* <Text className="text-gray-400 text-base mb-3"></Text> */}
        <TouchableOpacity
          className="flex-row items-center bg-blue-600 rounded-lg p-3"
          onPress={() => handleGithubPress("https://github.com/Naveen-X/Folixora")}
        >
          <Feather name="external-link" size={20} color="#FFFFFF" className="mr-2" />
          <Text className="text-white text-base flex-1">Visit our GitHub</Text>
          <Feather name="chevron-right" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Add more developer-related content here */}
    </ScrollView>
  );
}
