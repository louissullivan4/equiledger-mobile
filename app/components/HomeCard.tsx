import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from './CustomButton';
import { StackNavigationProp } from '@react-navigation/stack';

const screenHeight = Dimensions.get('window').height;

interface HomeCardProps {
    heightPercentage: number;
    navigation: StackNavigationProp<any>;
}

const HomeCard: React.FC<HomeCardProps> = ({ heightPercentage, navigation }) => {
    const height = screenHeight * (heightPercentage / 100);

    return (
        <View style={[styles.container, { height }]}>
            <MaterialIcons name={'receipt-long'} size={50} color="#000" style={styles.icon} />
            <Text style={styles.titleText}>My Expenses</Text>
            <Text style={styles.text}>A quick and easy way to track your business expenses on the go</Text>
            <View style={styles.buttonContainer}>
                <CustomButton 
                    title="New Expense" 
                    onPress={() => navigation.navigate('ExpenseStack', { screen: 'NewExpense' })}
                    fontSize={15} 
                    backgroundColor='#B59CE0' 
                    fontColor='white'
                />
                <CustomButton 
                    title="View Expense" 
                    onPress={() => navigation.navigate('ExpenseStack', { screen: 'ExpenseMain' })}
                    fontSize={15} 
                    backgroundColor='#D7CBED' 
                    fontColor='white' 
                />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        justifyContent: 'center',
    },
    icon: {
        marginRight: 8,
        color: '#B59CE0',
        right: 5,
    },
    titleText: {
        fontSize: 25,
        marginBottom: 10,
        color: '#B59CE0',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        marginTop: 10,
    },
    text: {
        fontSize: 15,
        color: '#D7CBED',
        fontFamily: 'Inter',
        fontWeight:'light',
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        marginTop: 50,
    },
});

export default HomeCard;
