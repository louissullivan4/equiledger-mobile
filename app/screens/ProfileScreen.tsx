import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, StyleSheet } from "react-native";
import ProfileCard from "../components/ProfileCard";
import TopBar from "../components/TopBar";

type User = {
    name: string;
    email: string;
    token: string;
};

type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    ExpenseScreen: undefined;
    CreateExpense: undefined;
    IncomeScreen: undefined;
    CreateIncome: undefined;
    Profile: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Profile">;

type Props = {
    navigation: HomeScreenNavigationProp;
    user: User;
    setUser: (user: User | null) => void;
};

const LoginScreen: React.FC<Props> = ({ navigation, user, setUser }) => {
    return (
        <View style={styles.container}>
            <TopBar heightPercentage={9} user={user} navigation={navigation} setUser={setUser}/>
            <View style={styles.profilecard}>
                <ProfileCard heightPercentage={70} navigation={navigation} user={user} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F0F0",
    },
    profilecard: {
        marginTop: 7
    }
});

export default LoginScreen;
