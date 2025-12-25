import React from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import StyledIonicons from './StyledIonicons';

export default function CartItem({ item, onRemove }) {
    // Hàm render nút xóa khi vuốt (Dùng Animated của React Native thuần, cực ổn định)
    const renderRightActions = (progress, dragX) => {
        // Hiệu ứng scale nút xóa khi kéo
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity 
                onPress={() => onRemove(item.cartId)}
                activeOpacity={0.7}
            >
                <View className="bg-red-500 w-20 h-[90%] my-2 rounded-3xl justify-center items-center mr-2">
                    <Animated.View style={{ transform: [{ scale }] }}>
                        <StyledIonicons name="trash-outline" size={28} className="text-white" />
                    </Animated.View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable 
            renderRightActions={renderRightActions}
            friction={2}
            rightThreshold={40}
        >
            <View className="flex-row items-center bg-surface-light dark:bg-surface-dark p-4 rounded-3xl border border-border-light dark:border-border-dark mx-6 my-2">
                <Image source={{ uri: item.image }} className="w-16 h-16 rounded-2xl" />
                
                <View className="flex-1 ml-4">
                    <Text className="text-text-main-light dark:text-text-main-dark font-bold text-lg">
                        {item.name}
                    </Text>
                    <Text className="text-text-muted-light dark:text-text-muted-dark text-[11px]" numberOfLines={1}>
                        {item.size} | {item.shot} shot | {item.select} {item.select === 'Cold' ? `| ${item.ice} ice` : ''}
                    </Text>
                    <Text className="text-primary font-bold mt-1 text-base">
                        ${item.totalPrice}
                    </Text>
                </View>

                <View className="bg-primary/10 px-3 py-1 rounded-full">
                    <Text className="text-primary font-bold text-xs">x{item.quantity}</Text>
                </View>
            </View>
        </Swipeable>
    );
}