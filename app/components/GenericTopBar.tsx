import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

interface GenericTopBarProps {
    heightPercentage: number;
    title: string;
}

const GenericTopBar: React.FC<GenericTopBarProps> = ({ heightPercentage, title }) => {
    const height = screenHeight * (heightPercentage / 100);

    return (
        <View style={[styles.container, { height }]}>
            <View style={styles.topContainer}>
                <Text style={styles.topText}>{ title }</Text>
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
        color: '#fff', // White text
        fontFamily: 'Inter', // Custom font
        fontWeight: 'bold',
    },
    topContainer: {
        paddingTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

export default GenericTopBar;
