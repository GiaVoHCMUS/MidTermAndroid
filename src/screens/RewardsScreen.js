import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StyledIonicons from '../components/StyledIonicons';
import { useCart } from '../context/CartContext';

export default function RewardsScreen({ navigation }) {
    const { stamps, totalPoints, resetStamps, orders } = useCart();
    
    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark px-6">
            <Text className="text-center text-text-main-light dark:text-text-main-dark text-xl font-bold py-4">Rewards</Text>

            {/* Loyalty Card (3 điểm) */}
            <View className="bg-primary p-6 rounded-[32px] mb-6">
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
                {stamps === 8 && (
                    <TouchableOpacity onPress={resetStamps} className="mt-4 bg-accent py-2 rounded-xl items-center">
                        <Text className="text-primary font-bold">Redeem 1 Free Coffee (Reset)</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Points Display */}
            <TouchableOpacity 
                onPress={() => navigation.navigate('Redeem')}
                className="bg-surface-light dark:bg-surface-dark p-6 rounded-[32px] flex-row justify-between items-center mb-6"
            >
                <View>
                    <Text className="text-text-muted-light text-xs">My Points</Text>
                    <Text className="text-text-main-light dark:text-text-main-dark text-3xl font-bold">{totalPoints}</Text>
                </View>
                <View className="bg-primary/10 px-4 py-2 rounded-xl">
                    <Text className="text-primary font-bold">Redeem drinks</Text>
                </View>
            </TouchableOpacity>

            <Text className="text-text-main-light dark:text-text-main-dark font-bold mb-4">History Rewards</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Điểm thưởng ảo - Logic này thầy yêu cầu hiển thị list */}
                {orders.map(order => (
                    <View key={order.id} className="flex-row justify-between items-center mb-4 pb-4 border-b border-border-light dark:border-border-dark">
                        <View>
                            <Text className="text-text-main-light dark:text-text-main-dark font-bold">{order.items[0].name}</Text>
                            <Text className="text-text-muted-light text-xs"> {order.date}</Text>
                        </View>
                        <Text className="text-text-main-light dark:text-text-main-dark font-bold">+ {order.pointsEarned}</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}