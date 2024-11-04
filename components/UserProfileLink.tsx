import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { API_DOMAIN } from '@/config/api';
import { router } from 'expo-router';

interface UserProfileLinkProps {
  userId: string;
  name: string;
  profileImage?: string;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  onPress?: () => void;
  routePath: string;
}

export default function UserProfileLink({ 
  userId, 
  name, 
  profileImage, 
  size = 'medium',
  showName = true,
  onPress,
  routePath
}: UserProfileLinkProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    router.push({
      pathname: routePath,
      params: {
        userId,
        userName: name
      }
    });
  };

  const sizeMap = {
    small: { container: 30, image: 30, icon: 24, font: 14 },
    medium: { container: 36, image: 36, icon: 30, font: 16 },
    large: { container: 80, image: 80, icon: 60, font: 18 }
  };

  const dimensions = sizeMap[size];

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
    >
      {profileImage ? (
        <Image 
          source={{ uri: API_DOMAIN + '/' + profileImage }}
          style={[styles.profileImage, { 
            width: dimensions.image, 
            height: dimensions.image,
            borderRadius: dimensions.image / 2 
          }]}
        />
      ) : (
        <View style={[styles.profileImage, { 
          width: dimensions.container, 
          height: dimensions.container,
          borderRadius: dimensions.container / 2 
        }]}>
          <Ionicons 
            name="person-circle-outline" 
            size={dimensions.icon} 
            color={Colors.light.icon} 
          />
        </View>
      )}
      {showName && (
        <ThemedText style={[styles.name, { fontSize: dimensions.font }]}>
          {name}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    marginLeft: 8,
    fontWeight: '600',
  }
}); 