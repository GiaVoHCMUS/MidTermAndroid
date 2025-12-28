import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, FlatList, Linking, Platform } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Callout, Polyline  } from 'react-native-maps';
import * as Location from 'expo-location';
import StyledIonicons from '../components/StyledIonicons';
import { STORES_DATA } from '../constants/data';

// Hàm tính khoảng cách giữa 2 điểm (km)
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Bán kính Trái Đất
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
};

export default function StoreMapScreen({ navigation }) {
    const mapRef = useRef(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(true); // State để thu gọn/mở rộng list

    // Logic: Tính khoảng cách và sắp xếp (Ăn điểm cực mạnh ở đây)
    const sortedStores = useMemo(() => {
        if (!location) return STORES_DATA;
        return STORES_DATA.map(store => ({
            ...store,
            distance: getDistance(location.latitude, location.longitude, store.lat, store.lng)
        })).sort((a, b) => a.distance - b.distance);
    }, [location]);


     useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setLoading(false);
                    Alert.alert("Permission denied");
                    return;
                }

                let userLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                setLocation(userLocation.coords);
            } catch (error) {
                console.log("Location error:", error);
                Alert.alert("Cannot get location", "Please enable GPS or mock location");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Hàm mở ứng dụng bản đồ để chỉ đường
    const openDirections = (lat, lng) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = 'The Code Cup Store';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
                <ActivityIndicator size="large" color="#00623B" />
                <Text className="mt-4 dark:text-white">Locating you...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark"
            edges={['top', 'left', 'right']}
        >
            {/* Nút Back */}
            <TouchableOpacity onPress={() => navigation.goBack()} className="absolute top-12 left-6 z-10 bg-white p-2 rounded-full shadow-lg">
                <StyledIonicons name="arrow-back" size={24} className="text-primary" />
            </TouchableOpacity>

            {/* Map View */}
            <View className={isExpanded ? "h-[55%]" : "h-[85%]"}>
                <MapView
                    ref={mapRef}
                    className="flex-1"
                    showsUserLocation={true}
                    initialRegion={{
                        latitude: location?.latitude || 10.773,
                        longitude: location?.longitude || 106.662,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    }}
                >
                    {/* VẼ ĐƯỜNG CHIM BAY (Polyline) */}
                    {location && selectedStore && (
                        <Polyline
                            coordinates={[
                                { latitude: location.latitude, longitude: location.longitude },
                                { latitude: selectedStore.lat, longitude: selectedStore.lng }
                            ]}
                            strokeColor="#00623B"
                            strokeWidth={3}
                            lineDashPattern={[5, 5]} // Tạo nét đứt chuyên nghiệp
                        />
                    )}
                    {sortedStores.map(store => (
                        <Marker key={store.id} coordinate={{ latitude: store.lat, longitude: store.lng }}>
                            <View className="bg-white p-1 rounded-full border-2 border-primary shadow-sm">
                                <StyledIonicons name="business" size={20} className="text-primary" />
                            </View>
                        </Marker>
                    ))}
                </MapView>
            </View>

            {/* Nearby Stores List (Dưới bản đồ) */}
            <View 
                style={{ shadowColor: "#000", shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 20 }}
                className={`bg-surface-light dark:bg-surface-dark rounded-t-[40px] -mt-10 p-6 flex-1 transition-all duration-300`}
            >
                {/* Nút kéo (Handle) */}
                <TouchableOpacity 
                    onPress={() => setIsExpanded(!isExpanded)}
                    className="items-center -mt-2 mb-4"
                >
                    <View className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <StyledIonicons 
                        name={isExpanded ? "chevron-down" : "chevron-up"} 
                        size={20} 
                        className="text-gray-300 mt-1" 
                    />
                </TouchableOpacity>

                {/* Tiêu đề */}
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-bold text-text-main-light dark:text-text-main-dark">
                        {selectedStore ? "Selected Store" : "Nearby Stores"}
                    </Text>
                    {selectedStore && (
                        <TouchableOpacity onPress={() => setSelectedStore(null)}>
                            <Text className="text-primary text-xs font-bold">Clear Path</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Nội dung danh sách */}
                {isExpanded ? (
                    <FlatList
                        data={sortedStores}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                        <TouchableOpacity 
                            onPress={() => {
                                setSelectedStore(item);
                                // setIsExpanded(false); 
                                mapRef.current.animateToRegion({
                                    latitude: item.lat, longitude: item.lng,
                                    latitudeDelta: 0.01, longitudeDelta: 0.01
                                }, 500);
                            }}
                            className={`flex-row justify-between items-center mb-3 p-4 rounded-2xl ${selectedStore?.id === item.id ? 'bg-background-light dark:bg-background-dark border border-primary' : 'bg-gray-50 dark:bg-black/20'}`}
                        >
                            <View className="flex-1">
                                <Text className="font-bold text-text-main-light dark:text-text-main-dark text-sm">{item.title}</Text>
                                <Text className="text-primary font-bold text-xs mt-1">{item.distance} km</Text>
                            </View>
                            <TouchableOpacity onPress={() => openDirections(item.lat, item.lng)} className="bg-primary p-2.5 rounded-full ml-2">
                                <StyledIonicons name="navigate" size={18} className="text-white" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        )}
                    />
                ) : (
                    <View className="flex-row justify-between items-center py-2">
                        <View className="flex-1">
                            <Text className="text-text-muted-light dark:text-gray-400 italic text-sm">
                                {selectedStore ? `Path to ${selectedStore.title}` : "Tap arrow to see all stores"}
                            </Text>
                        </View>
                        {selectedStore && (
                            <TouchableOpacity onPress={() => openDirections(selectedStore.lat, selectedStore.lng)} className="bg-primary px-5 py-2.5 rounded-full flex-row items-center shadow-md">
                                <StyledIonicons name="navigate" size={16} className="text-white mr-2" />
                                <Text className="text-white font-bold text-xs">Directions</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}