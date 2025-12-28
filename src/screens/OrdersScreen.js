import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StyledIonicons from '../components/StyledIonicons';
import { useCart } from '../context/CartContext';

export default function OrdersScreen() {
    const { orders, transitionToHistory } = useCart();
    const [activeTab, setActiveTab] = useState('ongoing');

    // Lọc đơn hàng theo tab
    const filteredOrders = orders.filter(o => o.status === activeTab);

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <Text className="text-center text-text-main-light dark:text-text-main-dark text-xl font-bold py-4">My Orders</Text>
            
            {/* Tabs Switcher */}
            <View className="flex-row mx-6 mb-6 bg-surface-light dark:bg-surface-dark rounded-full p-1">
                {['ongoing', 'history'].map(tab => (
                    <TouchableOpacity 
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        className={`flex-1 py-3 rounded-full ${activeTab === tab ? 'bg-white dark:bg-primary shadow-sm' : ''}`}
                    >
                        <Text className={`text-center font-bold capitalize ${activeTab === tab ? 'text-primary dark:text-white' : 'text-text-muted-light'}`}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            <FlatList
                data={filteredOrders}
                keyExtractor={item => item.cartId}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24 }}
                renderItem={({ item }) => (
                    <View className="bg-surface-light dark:bg-surface-dark p-4 rounded-3xl mb-4 border border-border-light dark:border-border-dark">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-text-muted-light text-xs">{item.date}</Text>
                            <Text className="text-primary font-bold">${item.total}</Text>
                        </View>
                        
                        {item.items.map((coffee, idx) => (
                            <View key={`${item.id}-${idx}`} className="flex-row items-center mt-2">
                                <StyledIonicons name="cafe" size={16} className="text-primary mr-2" />
                                <Text className="text-text-main-light dark:text-text-main-dark text-sm">{coffee.name} x{coffee.quantity}</Text>
                            </View>
                        ))}

                        {/* Nút chuyển trạng thái */}
                        {item.status === 'ongoing' && (
                            <TouchableOpacity 
                                onPress={() => transitionToHistory(item.id)}
                                className="mt-4 bg-primary/10 py-2 rounded-xl items-center border border-primary/20"
                            >
                                <Text className="text-primary font-bold">Mark as Delivered</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />
        </SafeAreaView>
    );
}