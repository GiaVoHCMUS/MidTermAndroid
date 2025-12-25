import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { REDEEM_DATA } from '../constants/data';
import StyledIonicons from '../components/StyledIonicons';


export default function RedeemScreen({ navigation }) {
    const { totalPoints, redeemPoints } = useCart();

    const handleRedeem = (item) => {
        if (redeemPoints(item.points)) {
            Alert.alert("Success", `You have redeemed a ${item.name}!`);
        } else {
            Alert.alert("Error", "Not enough points!");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark px-6">
            <View className="flex-row items-center py-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <StyledIonicons name="arrow-back" size={24} className="text-text-main-light dark:text-text-main-dark mr-4" />
                </TouchableOpacity>
                <Text className="text-xl font-bold dark:text-white">Redeem</Text>
            </View>

            <FlatList
                data={REDEEM_DATA}
                renderItem={({ item }) => (
                    <View className="flex-row justify-between items-center py-4 border-b border-border-light">
                        <Image source={{ uri: item.image }} className="w-16 h-16 rounded-xl" />
                        <View className="flex-1 ml-4">
                            <Text className="font-bold dark:text-white">{item.name}</Text>
                            <Text className="text-xs text-text-muted-light">Valid until 01.01.26</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => handleRedeem(item)}
                            className="bg-primary px-4 py-2 rounded-full"
                        >
                            <Text className="text-white text-xs font-bold">{item.points} pts</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}