import React, { useState, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StyledIonicons from '../components/StyledIonicons'; // Import component của bạn
import { useCart } from '../context/CartContext';

export default function DetailsScreen({ route, navigation }) {
    const { product } = route.params;
    const { cart, addToCart } = useCart();

    const [quantity, setQuantity] = useState(1);
    const [shot, setShot] = useState('Single');     // Single, Double
    const [size, setSize] = useState('M');          // S, M, L
    const [select, setSelect] = useState("Cold")    // Hot, Cold
    const [ice, setIce] = useState('Medium');       // Less, Medium, Full
    const [isCartPreviewVisible, setCartPreviewVisible] = useState(false);

    // Logic tính giá động
    const totalPrice = useMemo(() => {
        let extra = 0;
        if (shot === 'Double') extra += 0.50;
        if (size === 'S') extra -= 0.20;
        if (size === 'L') extra += 0.50;
        return ((product.price + extra) * quantity).toFixed(2);
    }, [shot, size, quantity, product.price]);

    // Hàm thêm vào giỏ hàng thật
    const handleAddToCart = () => {
        const itemToCart = {
            id: product.id,
            name: product.name,
            image: product.image,
            quantity,
            shot,
            size,
            select, // 'Hot' hoặc 'Cold'
            ice: select === 'Hot' ? 'None' : ice, // Logic bạn yêu cầu: Hot thì đá là None
            totalPrice: totalPrice, 
        };
        addToCart(itemToCart);
        
        // Sau khi thêm, có thể chọn 1 trong 2 cách:
        // Cách A: Chuyển thẳng sang trang Cart
        // navigation.navigate('Cart');

        // Cách B: Chỉ hiện Modal Preview 
        setCartPreviewVisible(true);
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            {/* Header */}
            <View className="flex-row justify-between items-center px-6 py-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <StyledIonicons name="arrow-back" size={28} className="text-text-main-light dark:text-text-main-dark" />
                    </TouchableOpacity>
                <Text className="text-text-main-light dark:text-text-main-dark text-lg font-bold">Details</Text>
                <TouchableOpacity onPress={() => setCartPreviewVisible(true)}>
                    <StyledIonicons name="cart-outline" size={28} className="text-primary" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <View className="items-center">
                    <Image source={{ uri: product.image }} className="w-64 h-64 rounded-full" resizeMode="contain" />
                </View>

                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-text-main-light dark:text-text-main-dark text-2xl font-bold">{product.name}</Text>
                        <Text className="text-text-muted-light dark:text-text-muted-dark italic">Classic taste</Text>
                    </View>
                    
                    {/* Quantity Selector */}
                    <View className="flex-row items-center bg-surface-light dark:bg-surface-dark rounded-full px-3 py-1">
                        <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                            <StyledIonicons name="remove" size={20} className="text-primary" />
                        </TouchableOpacity>
                        <Text className="mx-4 font-bold text-text-main-light dark:text-text-main-dark">{quantity}</Text>
                        <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                            <StyledIonicons name="add" size={20} className="text-primary" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Customization */}
                <View className="space-y-6">
                    {/* Shot Selection */}
                    <View>
                        <Text className="text-text-main-light dark:text-text-main-dark font-bold mb-3">Shot</Text>
                        <View className="flex-row space-x-3">
                            {['Single', 'Double'].map((item) => (
                                <TouchableOpacity 
                                    key={item}
                                    onPress={() => setShot(item)}
                                    className={`px-6 py-2 rounded-full border ${shot === item ? 'bg-primary border-primary' : 'border-border-light dark:border-border-dark'}`}
                                >
                                    <Text className={shot === item ? 'text-white font-bold' : 'text-text-main-light dark:text-text-main-dark'}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Size Selection (Dùng StyledIonicons) */}
                    <View>
                        <Text className="text-text-main-light dark:text-text-main-dark font-bold mb-3">Size</Text>
                        <View className="flex-row justify-around items-end">
                            {[
                                { label: 'S', size: 24 },
                                { label: 'M', size: 32 },
                                { label: 'L', size: 40 }
                            ].map((item) => (
                                <TouchableOpacity key={item.label} onPress={() => setSize(item.label)} className="items-center">
                                    <StyledIonicons 
                                        name="cafe" 
                                        size={item.size} 
                                        className={size === item.label ? "text-primary" : "text-text-muted-light dark:text-text-muted-dark"} 
                                    />
                                    <Text className={`mt-1 ${size === item.label ? 'text-primary font-bold' : 'text-text-muted-light dark:text-text-muted-dark'}`}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Hot, Cold Selection */}
                    <View>
                        <Text className="text-text-main-light dark:text-text-main-dark font-bold mb-3">Select</Text>
                        <View className="flex-row justify-around items-end">
                            <TouchableOpacity onPress={() => setSelect("Hot")} className="items-center">
                                <StyledIonicons 
                                    name="flame-outline" 
                                    size={32} 
                                    className={select === "Hot" ? "text-primary" : "text-text-muted-light dark:text-text-muted-dark"} 
                                />
                                <Text className={`mt-1 ${select === "Hot" ? 'text-primary font-bold' : 'text-text-muted-light dark:text-text-muted-dark'}`}>Hot</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelect("Cold")} className="items-center">
                                <StyledIonicons 
                                    name="snow-outline"
                                    size={32} 
                                    className={select === "Cold" ? "text-primary" : "text-text-muted-light dark:text-text-muted-dark"} 
                                />
                                <Text className={`mt-1 ${select === "Cold" ? 'text-primary font-bold' : 'text-text-muted-light dark:text-text-muted-dark'}`}>Cold</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Ice Selection */}
                    {select !== "Hot" &&
                        <View>
                            <Text className="text-text-main-light dark:text-text-main-dark font-bold mb-3">Ice</Text>
                            <View className="flex-row justify-between">
                                {['Less', 'Medium', 'Full'].map((item) => (
                                    <TouchableOpacity 
                                    key={item} 
                                    onPress={() => setIce(item)}
                                    className={`flex-1 mx-1 items-center py-3 rounded-xl border ${ice === item ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : 'border-border-light dark:border-border-dark'}`}
                                    >
                                        <StyledIonicons name="snow" size={20} className={ice === item ? "text-blue-500" : "text-text-muted-light"} />
                                        <Text className={`text-xs mt-1 ${ice === item ? 'text-blue-600 font-bold' : 'text-text-muted-light dark:text-text-muted-dark'}`}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    }
                </View>

                <View className="h-20" /> 
            </ScrollView>

            {/* Bottom Bar */}
            <View className="p-6 border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-text-muted-light dark:text-text-muted-dark font-medium">Total Amount</Text>
                    <Text className="text-text-main-light dark:text-text-main-dark text-2xl font-bold">${totalPrice}</Text>
                </View>
                <TouchableOpacity 
                    onPress={handleAddToCart}
                    className="bg-primary py-4 rounded-2xl items-center shadow-lg active:opacity-80"
                >
                    <Text className="text-white font-bold text-lg">Add to cart</Text>
                </TouchableOpacity>
            </View>

            {/* MODAL PREVIEW */}
            <Modal visible={isCartPreviewVisible} transparent={true} animationType="slide">
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-background-light dark:bg-background-dark p-6 rounded-t-3xl min-h-[300px]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold dark:text-white">Cart Preview ({cart.length})</Text>
                            <TouchableOpacity onPress={() => setCartPreviewVisible(false)}>
                                <StyledIonicons name="close" size={24} className="text-text-main-light dark:text-text-main-dark" />
                            </TouchableOpacity>
                        </View>

                        {/* Render từ cart thật */}
                        {cart.length > 0 ? (
                            <ScrollView className="max-h-60">
                                {cart.map((item) => (
                                    <View key={item.id} className="flex-row justify-between py-3 border-b border-border-light dark:border-border-dark">
                                        <View className="flex-1 pr-4">
                                            <Text className="font-bold dark:text-white">{item.name} <Text className="text-primary">x{item.quantity}</Text></Text>
                                            <Text className="text-[10px] text-text-muted-light" numberOfLines={1}>
                                                {item.size} | {item.select} {item.select === 'Cold' ? `| ${item.ice} ice` : ''}
                                            </Text>
                                        </View>
                                        <Text className="font-bold text-primary">${item.totalPrice}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        ) : (
                            <View className="items-center py-10">
                                <Text className="text-text-muted-light italic">Your cart is currently empty</Text>
                            </View>
                        )}

                        <TouchableOpacity 
                            onPress={() => {setCartPreviewVisible(false); navigation.navigate('Cart');}}
                            className="bg-primary mt-6 py-4 rounded-xl items-center"
                        >
                            <Text className="text-white font-bold">Go to Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}