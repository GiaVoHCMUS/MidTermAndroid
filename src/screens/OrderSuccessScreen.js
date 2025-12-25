import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StyledIonicons from '../components/StyledIonicons';

export default function OrderSuccessScreen({ navigation }) {
    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark justify-center items-center px-10">
        
            {/* Icon thành công - Vẽ đẹp một chút để ăn điểm UI */}
            <View className="bg-primary/10 p-10 rounded-full mb-8">
                <StyledIonicons name="checkmark-circle" size={100} className="text-primary" />
            </View>

            <Text className="text-text-main-light dark:text-text-main-dark text-2xl font-bold mb-2">
                Order Success!
            </Text>
            
            <Text className="text-text-muted-light dark:text-text-muted-dark text-center mb-10">
                Your order has been placed successfully. You can track the delivery status now.
            </Text>

            {/* Nút Track My Order (1 điểm) */}
            <TouchableOpacity 
                onPress={() => navigation.navigate('My Orders')}
                className="bg-primary w-full py-4 rounded-2xl items-center shadow-lg"
            >
                <Text className="text-white font-bold text-lg">Track My Order</Text>
            </TouchableOpacity>
            
            {/* Nút quay lại Home */}
            <TouchableOpacity 
                onPress={() => navigation.navigate("Main")}
                className="mt-4 py-2"
            >
                <Text className="text-primary font-bold">Back to Home</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}