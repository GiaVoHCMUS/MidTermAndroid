import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stamps, setStamps] = useState(0); // Tích điểm (max 8)
    const [totalPoints, setTotalPoints] = useState(2000); // Điểm thưởng ban đầu

    // Load dữ liệu khi mở app
    useEffect(() => {
        loadData();
    }, []);

    // Lưu dữ liệu mỗi khi có thay đổi
    useEffect(() => {
        saveData();
    }, [cart, orders, stamps, totalPoints]);

    const saveData = async () => {
        try {
            const data = { cart, orders, stamps, totalPoints };
            await AsyncStorage.setItem('@the_code_cup_data', JSON.stringify(data));
        } catch (e) { 
            console.log("Error saving data", e); 
        }
    };

    const loadData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@the_code_cup_data');
            if (jsonValue != null) {
                const data = JSON.parse(jsonValue);
                setCart(data.cart || []);
                setOrders(data.orders || []);
                setStamps(data.stamps || 0);
                setTotalPoints(data.totalPoints || 0);
            }
        } catch (e) { 
            console.log("Error loading data", e); 
        }
    };

    // Action: Thêm vào giỏ
    const addToCart = (item) => {
        setCart((prev) => [...prev, { ...item, cartId: Date.now().toString() }]);
    };

    // Action: Xóa khỏi giỏ
    const removeFromCart = (cartId) => {
        setCart((prev) => prev.filter(i => i.cartId !== cartId));
    };

    // Action: Checkout (Thanh toán)
    const checkout = () => {
        if (cart.length === 0) return;
        
        const newOrder = {
            id: Date.now().toString(),
            items: [...cart],
            total: cart.reduce((sum, i) => sum + parseFloat(i.totalPrice), 0).toFixed(2),
            status: 'ongoing',
            date: new Date().toLocaleString(),
        };

        setOrders([newOrder, ...orders]);
        
        // Logic Rewards (Trang 8 PDF)
        let newStamps = stamps + 1;
        if (newStamps >= 8) newStamps = 0; // Reset khi đủ 8
        setStamps(newStamps);
        
        // Cộng điểm (ví dụ $1 = 12 pts)
        const pointsEarned = Math.floor(parseFloat(newOrder.total) * 12);
        setTotalPoints(prev => prev + pointsEarned);

        setCart([]); // Xóa giỏ hàng sau khi mua
    };

    return (
        <CartContext.Provider value={{ 
            cart, addToCart, removeFromCart, checkout, 
            orders, setOrders, stamps, setStamps, totalPoints, setTotalPoints 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);