import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import StyledIonicons from '../components/StyledIonicons';

// Giả lập dữ liệu giỏ hàng (Ngày mai chúng ta sẽ thay bằng Context)
const INITIAL_CART = [
    {
        id: '1',
        name: 'Americano',
        options: 'single | iced | medium | full ice',
        price: 3.00,
        image: 'https://bit.ly/coffee-americano',
    },
    {
        id: '2',
        name: 'Cappuccino',
        options: 'single | iced | medium | full ice',
        price: 3.50,
        image: 'https://bit.ly/coffee-cappuccino',
    },
    {
        id: '3',
        name: 'Flat White',
        options: 'single | iced | medium | full ice',
        price: 3.00,
        image: 'https://bit.ly/coffee-flatwhite',
    },
];

export default function CartScreen({ navigation }) {
    const [cartItems, setCartItems] = useState(INITIAL_CART);

    // Tính tổng tiền (3 điểm)
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    // Hàm xóa item (3 điểm - Gesture-Based Item Removal)
    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    // Component hiển thị nút Xóa khi vuốt sang trái
    const renderRightActions = (id) => (
        <TouchableOpacity 
            onPress={() => removeItem(id)}
            className="bg-red-100 dark:bg-red-900/30 justify-center items-center w-20 h-[90%] my-2 rounded-2xl"
        >
            <StyledIonicons name="trash-outline" size={28} className="text-red-500" />
        </TouchableOpacity>
    );

    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
                
                {/* Header */}
                <View className="flex-row items-center px-6 py-4">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <StyledIonicons name="arrow-back" size={28} className="text-text-main-light dark:text-text-main-dark" />
                    </TouchableOpacity>
                    <Text className="text-text-main-light dark:text-text-main-dark text-xl font-bold ml-4">My Cart</Text>
                </View>

                {/* Danh sách sản phẩm (7 điểm - Cart Item Rendering) */}
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
                    ListEmptyComponent={
                        <View className="items-center mt-20">
                            <StyledIonicons name="cart-outline" size={80} className="text-gray-300" />
                            <Text className="text-text-muted-light mt-4">Your cart is empty</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <Swipeable 
                            renderRightActions={() => renderRightActions(item.id)}
                            friction={2}
                        >
                            <View className="flex-row items-center bg-surface-light dark:bg-surface-dark p-4 rounded-3xl my-2 border border-border-light dark:border-border-dark">
                                <Image source={{ uri: item.image }} className="w-16 h-16 rounded-2xl" />
                                <View className="flex-1 ml-4">
                                    <Text className="text-text-main-light dark:text-text-main-dark font-bold text-lg">{item.name}</Text>
                                    <Text className="text-text-muted-light dark:text-text-muted-dark text-xs" numberOfLines={1}>
                                        {item.options}
                                    </Text>
                                    <Text className="text-text-main-light dark:text-text-main-dark font-bold mt-1">${item.price.toFixed(2)}</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-text-main-light dark:text-text-main-dark font-bold">x 1</Text>
                                </View>
                            </View>
                        </Swipeable>
                    )}
                />

                {/* Footer: Total & Checkout (3 điểm + 1 điểm) */}
                {cartItems.length > 0 && (
                    <View className="absolute bottom-0 left-0 right-0 p-6 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-text-muted-light dark:text-text-muted-dark text-lg">Total Price</Text>
                            <Text className="text-text-main-light dark:text-text-main-dark text-2xl font-bold">${totalPrice}</Text>
                        </View>
                        
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('OrderSuccess')}
                            className="bg-primary flex-row py-4 rounded-2xl items-center justify-center shadow-lg"
                        >
                        <StyledIonicons name="cart" size={20} className="text-white mr-2" />
                            <Text className="text-white font-bold text-lg">Checkout</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </SafeAreaView>
        </GestureHandlerRootView>
    );
}