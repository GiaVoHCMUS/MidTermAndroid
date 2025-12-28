import React, { useEffect } from 'react';
import { View, Text, Image, Animated } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        // Hiệu ứng hiện dần logo
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();

        // Sau 2.5 giây tự động chuyển vào Home
        const timer = setTimeout(() => {
            navigation.replace('Main'); // Dùng replace để người dùng không quay lại màn hình này được
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View className="flex-1 bg-primary justify-center items-center">
            <Animated.View style={{ opacity: fadeAnim }} className="items-center">
                <View className="bg-white p-6 rounded-full mb-6 shadow-2xl">
                    <Text className="text-primary text-5xl">☕</Text>
                </View>
                
                <Text className="text-white text-3xl font-bold tracking-widest">
                    ORDINARY COFFEE HOUSE
                </Text>
                <Text className="text-white/70 mt-2 italic">
                    Premium Coffee Experience
                </Text>
            </Animated.View>
            
            <View className="absolute bottom-20">
                <Text className="text-white/50 text-xs">Loading your experience...</Text>
            </View>
        </View>
    );
}