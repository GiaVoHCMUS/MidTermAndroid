import React from "react";
import { View, Text, ScrollView, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COFFEE_LIST } from "../constants/data";
import { styled } from "nativewind";
import StyledIonicons from "../components/StyledIonicons";
import { useCart } from "../context/CartContext";

export default function HomeScreen({ navigation }) {
    const { stamps } = useCart();

    const Header = () => (
        <View className="flex-row justify-between items-center px-6 py-4">
            <View>
                <Text className="text-text-muted-light dark:text-text-muted-dark text-sm">Good morning</Text>
                <Text className="text-text-main-light dark:text-text-main-dark text-xl font-bold">Quoc Gia Vo</Text>
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
        <View className="bg-primary p-6 rounded-[32px] mb-6 mx-6">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white font-bold">Loyalty card</Text>
                <Text className="text-white">{stamps} / 8</Text>
            </View>
            <View className="flex-row justify-between bg-white/20 p-4 rounded-2xl">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <StyledIonicons 
                        key={i} 
                        name="cafe" 
                        size={24} 
                        className={i <= stamps ? "text-accent-active" : "text-accent-inactive"}
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