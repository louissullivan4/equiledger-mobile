import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import CustomButton from '../components/CustomButton';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL ?? '';

type User = {
    name: string;
    email: string;
    token: string;
};

export default function LoginScreen({ setUser }: { setUser: (user: User) => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (): Promise<void> => {
        try {
            const userData = await loginWithEmailAndPassword(email, password);
            await SecureStore.setItemAsync('user', JSON.stringify(userData));
            setUser(userData);
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.topText}>Login</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    style={styles.input}
                />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                    style={styles.input}
                />
                <CustomButton title="Submit" onPress={handleLogin} />
            </View>
        </TouchableWithoutFeedback>
    );
}

async function loginWithEmailAndPassword(email: string, password: string) {
    try {
        email = email.trim().toLowerCase();
        const response = await fetch(`${SERVER_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to login, please check your credentials.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B59CE0',
    },
    input: {
        width: '80%',
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    topText: {
        fontSize: 25,
        marginBottom: 10,
        color: '#fff',
        fontFamily: 'Inter',
        fontWeight: 'bold',
    },
});
