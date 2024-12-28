import React from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import { StackNavigationProp } from '@react-navigation/stack';
import LogoutButton from './LogoutButton';

const screenHeight = Dimensions.get('window').height;

type User = {
    name: string;
    email: string;
    token: string;
};

interface TopBarProps {
    heightPercentage: number;
    user: User | null;
    navigation: StackNavigationProp<any>;
    setUser: ((user: User | null) => void) | null;
}

const TopBar: React.FC<TopBarProps> = ({ heightPercentage, user, navigation, setUser }) => {
    const height = screenHeight * (heightPercentage / 100);
    
    const handleLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('user');
            if (setUser) {
                setUser(null);
            }
            navigation.replace('Login');
        } catch (error) {
            Alert.alert('Logout Failed', 'An error occurred while trying to log out.');
        }
    };

    return (
        <View style={[styles.container, { height }]}>
            <View style={styles.topContainer}>
                <Text style={styles.topText}>Hi {user?.name ? user.name : ''}</Text>
                <LogoutButton onPress={handleLogout} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#B59CE0',
        padding: 15,
    },
    topText: {
        fontSize: 25,
        color: '#fff',
        fontFamily: 'Inter',
        fontWeight: 'bold',
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

export default TopBar;
