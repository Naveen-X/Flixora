import { View } from "react-native";
import { useMode } from "../../context/ModeContext";
import HomeAnime from "../home/home-anime";
import HomeManga from "../home/home-manga";
import HomeMovies from "../home/home-movies";
import HomeTV from "../home/home-tv";

export default function Index() {
  const { mode } = useMode();

  return (
    <View className="flex-1 bg-slate-900">
      {mode === "anime" && <HomeAnime />}
      {mode === "manga" && <HomeManga />}
      {mode === "movies" && <HomeMovies />}
      {mode === "tv" && <HomeTV />}
    </View>
  );
}
