import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StyledIonicons from '../components/StyledIonicons';
import { useColorScheme } from 'nativewind';

export default function ProfileScreen() {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({
        name: 'Quoc Gia Vo',
        phone: '+84 847090205',
        email: 'quocgia2005@gmail.com',
        address: 'Kiet 2, Hung Nhon, Nam Hai Lang, Quang Tri'
    });

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark px-8">
            <View className="flex-row justify-between items-center py-6">
                <Text className="text-xl font-bold dark:text-white">Profile</Text>
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                    <StyledIonicons 
                        name={isEditing ? "checkmark-circle" : "create-outline"} 
                        size={24} 
                        className="text-primary" 
                    />
                </TouchableOpacity>
            </View>

            <View className="space-y-6">
                {Object.keys(user).map((key) => (
                    <View key={key} className="flex-row items-center border-b border-border-light py-2">
                        <StyledIonicons 
                            name={key === 'name' ? 'person-outline' : key === 'phone' ? 'call-outline' : key === 'email' ? 'mail-outline' : 'location-outline'} 
                            size={20} className="text-text-muted-light mr-4" 
                        />
                        <View className="flex-1">
                            <Text className="text-[10px] text-text-muted-light capitalize">{key}</Text>
                            {isEditing ? (
                                <TextInput 
                                    value={user[key]} 
                                    onChangeText={(val) => setUser({...user, [key]: val})}
                                    className="text-text-main-light dark:text-white font-bold py-1"
                                />
                            ) : (
                                <Text className="text-text-main-light dark:text-white font-bold">{user[key]}</Text>
                            )}
                        </View>
                    </View>
                ))}
            </View>

            {/* Dark/light mode */}
            <View className="mt-10 p-4 bg-surface-light dark:bg-surface-dark rounded-3xl">
                <Text className="text-text-main-light dark:text-white font-bold mb-4">Settings</Text>
                
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <StyledIonicons 
                            name={colorScheme === 'dark' ? "moon" : "sunny"} 
                            size={20} 
                            className="text-primary mr-3" 
                        />
                        <Text className="text-text-main-light dark:text-text-main-dark">Dark Mode</Text>
                    </View>
                    <Switch 
                        value={colorScheme === 'dark'} 
                        onValueChange={toggleColorScheme}
                        trackColor={{ false: "#767577", true: "#00623B" }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}