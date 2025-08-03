import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <BlurView
      tint="dark"
      intensity={90}
      blurReductionFactor={100}
      experimentalBlurMethod='dimezisBlurView'
      style={styles.tabBarContainer}
    >
      <View style={styles.tabBarContent}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabBarItem}
            >
              {options.tabBarIcon &&
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? '#FFFFFF' : '#808080',
                  size: 28,
                })}
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    borderRadius: 38, // Half of height for pill shape
    height: 75,
    overflow: 'hidden', // Clip content to rounded borders
    backgroundColor: 'transparent', // Make background fully transparent
    elevation: 8, // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1, // Add border
    borderColor: 'rgba(128, 128, 128, 0.3)', // Border color
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10, // Adjust as needed for icon centering
  },
});

export default CustomTabBar;
