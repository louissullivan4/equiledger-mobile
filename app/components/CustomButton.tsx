import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    iconName?: string;
    fontSize?: number;
    backgroundColor?: string;
    fontColor?: string;
    leftmargin?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    iconName,
    fontSize = 17,
    backgroundColor = 'white',
    fontColor = '#B59CE0',
    leftmargin = 0,
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }]}
            onPress={onPress}>
            {iconName && (
                <MaterialIcons name={iconName} size={30} color={fontColor} style={styles.icon} />
            )}
            <Text style={[styles.buttonText, { fontSize, color: fontColor, marginLeft: leftmargin  }]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '48%',
        paddingVertical: 15,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#F0F0F0',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 2,
        padding: 15,
        flexDirection: 'row',
    },
    buttonText: {
        fontFamily: 'Inter',
    },
    icon: {
        position: 'absolute',
        left: 10, 
    },
});

export default CustomButton;