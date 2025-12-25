import React from "react";
import { View, Text, ScrollView, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COFFEE_LIST } from "../constants/data";
import { styled } from "nativewind";

const StyledIonicons = styled(Ionicons);

export default function HomeScreen({ navigation }) {
    const Header = () => (
        <View className="flex-row justify-between items-center px-6 py-4">
            <View>
                <Text className="text-text-muted-light dark:text-text-muted-dark text-sm">Good morning</Text>
                <Text className="text-text-main-light dark:text-text-main-dark text-xl font-bold">Anderson</Text>
            </View>
            <View className="flex-row space-x-4">
                <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                    <StyledIonicons name="cart-outline" size={28} className="text-primary" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <StyledIonicons name="person-outline" size={28} className="text-primary" /> 
                </TouchableOpacity>
            </View>
        </View>
    );

    const LoyaltyCard = () => (
        <View className="mx-6 bg-primary p-5 rounded-3xl flex-row justify-between items-center mb-8 shadow-lg shadow-primary">
            <View>
                <Text className="text-white opacity-80 text-xs">Loyalty card</Text>
                <Text className="text-white text-lg font-bold">4 / 8</Text>
            </View>
            <View className="flex-row space-x-2 bg-white/20 p-2 rounded-xl">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Ionicons 
                        key={i} 
                        name="cafe" 
                        size={18} 
                        color={i <= 4 ? "#D4A574" : "#FFFFFF50"} 
                    />
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <Header />
            <ScrollView showsVerticalScrollIndicator={false}>
                <LoyaltyCard />
                
                <View className="px-6 mb-4">
                    <Text className="text-text-main-light dark:text-text-main-dark text-lg font-bold">Choose your coffee</Text>
                </View>

                {/* Coffee List View (3 điểm) */}
                <View className="px-4 pb-10">
                    <FlatList
                        data={COFFEE_LIST}
                        numColumns={2}
                        scrollEnabled={false} // Vì đã bọc trong ScrollView
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                onPress={() => navigation.navigate('Details', { product: item })} // Navigation Intent 
                                className="flex-1 m-2 bg-surface-light dark:bg-surface-dark p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
                            >
                                <Image 
                                    source={{ uri: item.image }} 
                                    className="w-full h-32 rounded-2xl mb-3"
                                    resizeMode="cover"
                                />
                                <Text className="text-text-main-light dark:text-text-main-dark font-bold">{item.name}</Text>
                                <Text className="text-text-muted-light dark:text-text-muted-dark text-xs">US ${item.price.toFixed(2)}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}