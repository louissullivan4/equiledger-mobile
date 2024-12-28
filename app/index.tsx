import * as React from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './components/MainTabNavigator';
import LoginScreen from './screens/Loginscreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

type User = {
    name: string;
    email: string;
    token: string;
};

export default function Index() {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const checkLoginStatus = async () => {
            const userInfo = await SecureStore.getItemAsync('user');
            if (userInfo) {
                setUser(JSON.parse(userInfo));
            }
            setLoading(false);
        };
        checkLoginStatus();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack.Navigator>
                {user ? (
                    <>

                    <Stack.Screen name="Main" options={{ headerShown: false }}>
                        {props => <MainTabNavigator {...props} user={user} setUser={setUser} />}
                    </Stack.Screen>
                    </>
                ) : (
                    <Stack.Screen name="Login" options={{headerShown: false}}>
                        {props => <LoginScreen {...props} setUser={setUser} />}
                    </Stack.Screen>
                )}
            </Stack.Navigator>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#B59CE0',
    },
});
