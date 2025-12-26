import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StyledIonicons from '../components/StyledIonicons';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

export default function CartScreen({ navigation }) {
    const { cart, removeFromCart, checkout } = useCart();

    const totalAmount = cart.reduce((sum, i) => sum + parseFloat(i.totalPrice), 0).toFixed(2);

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

                {/* List sản phẩm dùng CartItem đã viết ở trên */}
                <FlatList
                    data={cart}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CartItem item={item} onRemove={removeFromCart} />
                    )}
                    contentContainerStyle={{ paddingTop: 10, paddingBottom: 150 }}
                    ListEmptyComponent={
                        <View className="items-center mt-32 px-10">
                            <StyledIonicons name="cart-outline" size={100} className="text-gray-200 dark:text-gray-800" />
                            <Text className="text-text-muted-light dark:text-text-muted-dark mt-4 text-center">
                                Your cart is currently empty. Start adding some coffee!
                            </Text>
                        </View>
                    }
                />

                {/* Footer Checkout */}
                {cart.length > 0 && (
                    <View className="absolute bottom-0 left-0 right-0 p-6 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-text-muted-light dark:text-text-muted-dark text-lg">Total Price</Text>
                            <Text className="text-text-main-light dark:text-text-main-dark text-3xl font-bold">
                                ${totalAmount}
                            </Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => { checkout(); navigation.navigate('OrderSuccess'); }}
                            className="bg-primary py-4 rounded-2xl items-center shadow-lg active:opacity-80"
                        >
                            <Text className="text-white font-bold text-lg">Checkout</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </SafeAreaView>
        </GestureHandlerRootView>
    );
}