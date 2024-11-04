import { API_DOMAIN } from "@/config/api";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {DayImage, SharedPost} from "@/interfaces/interface";


const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width - 50; // 좌우 여백 고려

export default ({ item }: { item: SharedPost }) => {
    const renderImage = ({ item }: { item: DayImage }) => (
        <Image
          source={{ uri: API_DOMAIN +"/"+  item.path }}
          style={styles.slideImage}
          resizeMode="cover"
        />
      );
    return (
        
        <View style={styles.card}>
          <TouchableOpacity onPress={() => {
            router.push(`/home/profile?id=${item._id}`);
        }}>
 <View style={styles.cardHeader}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.date}>
          {new Date(item.date).getFullYear()}년 {new Date(item.date).getMonth() + 1}월 {new Date(item.date).getDate()}일
        </Text>
      </View>
        </TouchableOpacity>
     
       
      {item.images.length > 0 && (
        <View style={styles.imageContainer}>
          <FlatList
            data={item.images}
            renderItem={renderImage}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={true}
            keyExtractor={(image) => image._id}
          />
        </View>
      )}
      <Text style={styles.content}>{item.content}</Text>
    </View>
    )
};    


const styles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    date: {
      fontSize: 14,
      color: Colors.light.icon,
    },
    imageContainer: {
      height: 200,
      marginBottom: 15,
    },
    slideImage: {
      width: IMAGE_WIDTH,
      height: 200,
      borderRadius: 10,
    },
    content: {
      fontSize: 16,
    },
  }); 