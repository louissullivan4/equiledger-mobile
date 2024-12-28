import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

const CustomDropdown = ({ selectedValue, onValueChange, items }: { selectedValue: any, onValueChange: any, items: any[] }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (value: any) => {
        onValueChange(value);
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity style={styles.picker} onPress={() => setModalVisible(true)}>
                <Text style={styles.selectedText}>
                    {items.find(item => item.value === selectedValue)?.label || 'Select a category...'}
                </Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent={true} animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelect(item.value)} style={styles.modalItem}>
                                    <Text style={styles.modalItemText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    picker: {
        height: 50,
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        paddingLeft: 10,
        justifyContent: 'center',
    },
    selectedText: {
        fontSize: 16,
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        width: '80%',
        maxHeight: '50%',
        padding: 10,
    },
    modalItem: {
        padding: 15,
    },
    modalItemText: {
        fontSize: 16,
    },
});

export default CustomDropdown;