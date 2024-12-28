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
            <Text style={styles.topText}>{ title }</Text>
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
});

export default GenericTopBar;
