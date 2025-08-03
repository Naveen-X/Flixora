import { Image, ScrollView, Text, View } from "react-native";

export default function HomeAnime() {
  return (
    <ScrollView 
    className="bg-slate-950 flex-1"
    contentContainerStyle={{ paddingBottom: 75 }} // Add padding for the tab bar height
    >
      <View className="justify-center items-center py-20">
        <Text className="text-xl text-white">🍥 Anime Home Page 🍥</Text>
        <Image
          source={{ uri: 'https://i.pinimg.com/originals/e5/12/e8/e512e8bbc2ddc4cdfd389bde85ecd67d.jpg' }}
          style={{ width: 300, height: 300, marginTop: 20 }}
        />
        <Image
          source={{ uri: 'https://i.pinimg.com/originals/e5/12/e8/e512e8bbc2ddc4cdfd389bde85ecd67d.jpg' }}
          style={{ width: 300, height: 300, marginTop: 20 }}
        /><Image
          source={{ uri: 'https://i.pinimg.com/originals/e5/12/e8/e512e8bbc2ddc4cdfd389bde85ecd67d.jpg' }}
          style={{ width: 300, height: 300, marginTop: 20 }}
        /><Image
          source={{ uri: 'https://i.pinimg.com/originals/e5/12/e8/e512e8bbc2ddc4cdfd389bde85ecd67d.jpg' }}
          style={{ width: 300, height: 300, marginTop: 20 }}
        />
        {/* Add more content here to make it scrollable */}
        <Text className="text-white mt-20">Scroll down to see the frosted effect!</Text>
        <View style={{ height: 75 }} /> {/* Adjust space at the bottom to match tab bar height */}
      </View>
    </ScrollView>
  );
}

