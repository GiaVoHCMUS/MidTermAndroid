import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, TextInput  } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COFFEE_LIST } from "../constants/data";
import { styled } from "nativewind";
import StyledIonicons from "../components/StyledIonicons";
import { useCart } from "../context/CartContext";

const CATEGORIES = ['All', 'Coffee', 'Tea'];

export default function HomeScreen({ navigation }) {
    const { user } = useCart();
    
    // 1. State cho Tìm kiếm và Lọc
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // 2. Logic lọc sản phẩm Real-time (Ăn điểm Logic ở đây)
    const filteredProducts = useMemo(() => {
        return COFFEE_LIST.filter(item => {
            const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    const { stamps } = useCart();

    const Header = () => (
        <View className="flex-row justify-between items-center px-6 py-4">
            <View>
                <Text className="text-text-muted-light dark:text-text-muted-dark text-sm">Good morning</Text>
                <Text className="text-text-main-light dark:text-text-main-dark text-xl font-bold">{user.name}</Text>
            </View>
            <View className="flex-row space-x-4">
                <TouchableOpacity onPress={() => navigation.navigate('StoreMap')}>
                    <StyledIonicons name="location-outline" size={28} className="text-primary" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                    <StyledIonicons name="cart-outline" size={28} className="text-primary" />
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

    // Component tìm kiếm và lọc (Đây là phần User-Defined Feature)
    const FilterSection = () => (
        <View>
            {/* Search Bar */}
            <View className="px-6 mb-4">
                <View className="flex-row items-center bg-surface-light dark:bg-surface-dark px-4 py-1 rounded-2xl border border-border-light dark:border-border-dark">
                    <StyledIonicons name="search-outline" size={20} className="text-text-muted-light" />
                    <TextInput 
                        placeholder="Search your favorite coffee..." 
                        className="flex-1 ml-2 h-11 dark:text-white"
                        placeholderTextColor="#A0A0A0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery !== '' && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <StyledIonicons name="close-circle" size={18} className="text-gray-400" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Category Horizontal List */}
            <FlatList
                data={CATEGORIES}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, marginBottom: 20 }}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => setSelectedCategory(item)}
                        className={`mr-3 px-6 py-2.5 rounded-full border ${selectedCategory === item ? 'bg-primary border-primary shadow-md' : 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark'}`}
                    >
                        <Text className={`font-bold ${selectedCategory === item ? 'text-white' : 'text-text-muted-light dark:text-gray-400'}`}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            {/* Sử dụng ListHeaderComponent để gom Header, Search và Filter vào một danh sách cuộn mượt mà */}
            <FlatList
                data={filteredProducts}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <View>
                        {/* 1. Header Section */}
                        <Header />

                        {/* 2. Loyalty Card */}
                        <LoyaltyCard />
                        
                        {/* 3. Search Bar - Đã fix lỗi mất focus */}
                        <View className="px-6 mb-4">
                            <View className="flex-row items-center bg-surface-light dark:bg-surface-dark px-4 py-1 rounded-2xl border border-border-light dark:border-border-dark">
                                <StyledIonicons name="search-outline" size={20} className="text-text-muted-light" />
                                <TextInput 
                                    placeholder="Search your favorite coffee..." 
                                    className="flex-1 ml-2 h-11 dark:text-white"
                                    placeholderTextColor="#A0A0A0"
                                    value={searchQuery}
                                    onChangeText={(text) => setSearchQuery(text)} // Cập nhật trực tiếp
                                    autoCorrect={false}
                                />
                                {searchQuery !== '' && (
                                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                                        <StyledIonicons name="close-circle" size={18} className="text-gray-400" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {/* 4. Category Filter */}
                        <View className="mb-6">
                            <FlatList
                                data={CATEGORIES}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 24 }}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        onPress={() => setSelectedCategory(item)}
                                        className={`mr-3 px-6 py-2.5 rounded-full border ${selectedCategory === item ? 'bg-primary border-primary' : 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark'}`}
                                    >
                                        <Text className={`font-bold ${selectedCategory === item ? 'text-white' : 'text-text-muted-light dark:text-text-muted-dark'}`}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>

                        <View className="px-6 mb-4">
                            <Text className="text-text-main-light dark:text-text-main-dark text-lg font-bold">
                                {selectedCategory === 'All' ? 'Choose your coffee' : `${selectedCategory} Selection`}
                            </Text>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Details', { product: item })}
                        className="flex-1 m-2 mx-3 bg-white dark:bg-surface-dark p-3 rounded-[32px] border border-border-light dark:border-border-dark shadow-sm"
                    >
                        <Image source={{ uri: item.image }} className="w-full h-32 rounded-[24px] mb-3" resizeMode="cover" />
                        <View className="px-1">
                            <Text className="text-text-main-light dark:text-text-main-dark font-bold text-sm" numberOfLines={1}>{item.name}</Text>
                            <Text className="text-primary font-bold text-xs mt-1">${item.price.toFixed(2)}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                // Hiển thị khi không tìm thấy kết quả
                ListEmptyComponent={
                    <View className="items-center mt-10">
                        <StyledIonicons name="search-outline" size={60} className="text-gray-200" />
                        <Text className="text-text-muted-light dark:text-text-muted-dark mt-4 italic">No products found</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </SafeAreaView>
    );
}