import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

const screenHeight = Dimensions.get('window').height;

interface HomeCardProps {
    heightPercentage: number;
    navigation: StackNavigationProp<any>;
}

const ContactCard: React.FC<HomeCardProps> = ({ heightPercentage, navigation }) => {
    const height = screenHeight * (heightPercentage / 100);

    const handleClick = async () => {
        navigation.navigate('Contact');
    };
    
    return (
        <TouchableOpacity 
        style={[styles.container, { height }]}
        onPress={() => handleClick()}>
            <Text style={styles.titleText}>Contact Us</Text>
            <Text style={styles.text}>Need help? Click me!</Text>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        borderRadius: 10,
        justifyContent: 'center',
        width: '95%',
        marginTop: 10,
    },
    titleText: {
        fontSize: 25,
        marginBottom: 10,
        color: '#B59CE0',
        fontFamily: 'Inter',
        fontWeight: 'bold',
    },
    text: {
        fontSize: 15,
        color: '#D7CBED',
        fontFamily: 'Inter',
        fontWeight:'light',
        marginTop: 10,
    },
});

export default ContactCard;
