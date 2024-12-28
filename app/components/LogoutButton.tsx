import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface CustomButtonProps {
    onPress: () => void;
}

const LogoutButton: React.FC<CustomButtonProps> = ({onPress}) => {
    return (
        <TouchableOpacity
            style={[styles.button]}
            onPress={onPress}>
            <MaterialIcons name={'exit-to-app'} size={40} style={styles.icon} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        
    },
    buttonText: {
        fontFamily: 'Inter',
    },
    icon: {
        color: '#fff',
        marginBottom: 10, 
    },
});

export default LogoutButton;