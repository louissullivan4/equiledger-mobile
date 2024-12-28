import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, StyleSheet } from "react-native";
import TopBar from '../components/TopBar';
import HomeCard from "../components/HomeCard";
import ContactCard from "../components/ContactCard";

type User = {
    name: string;
    email: string;
    token: string;
};

type RootStackParamList = {
    Home: undefined;
    ExpenseScreen: undefined;
    CreateExpense: undefined;
    IncomeScreen: undefined;
    CreateIncome: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
    navigation: HomeScreenNavigationProp;
    user: User
    setUser: (user: User | null) => void
};

const HomeScreen: React.FC<Props> = ({ navigation, user, setUser }) => {
    return (
        <View style={styles.container}>
            <TopBar heightPercentage={9} user={user} navigation={navigation} setUser={setUser}/>
            <View style={styles.homecard}>
                <HomeCard heightPercentage={40} navigation={navigation} />
                <ContactCard heightPercentage={20} navigation={navigation} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F0F0",
    },
    homecard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;
