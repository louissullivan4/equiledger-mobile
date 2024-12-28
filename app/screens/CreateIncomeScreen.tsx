import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import GenericTopBar from '../components/GenericTopBar';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect, RouteProp } from '@react-navigation/native';
import CustomDropdown from '../components/CustomDropdown';
import Constants from 'expo-constants';

const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL ?? '';

type CreateExpenseScreenProps = {
  navigation: StackNavigationProp<any>;
  user: { token: string };
  route: RouteProp<{ params: { category?: string; expenseToEdit?: any } }, 'params'>;
};

// Define the local state shape for an expense
interface ExpenseFormState {
  id?: number; // If editing, we store the existing expense ID
  title: string;
  description: string;
  category: string;
  amount: string; // we keep this as a string to manage input easily
  currency: string;
  receipt: ImagePicker.ImagePickerAsset | null;
}

const CreateIncomeScreen = ({ navigation, user, route }: CreateExpenseScreenProps) => {
  // Extract expenseToEdit if present
  const expenseToEdit = route.params?.expenseToEdit;

  // Pre-fill the local state if editing
  const [expense, setExpense] = useState<ExpenseFormState>({
    id: expenseToEdit?.id,
    title: expenseToEdit?.title || '',
    description: expenseToEdit?.description || '',
    category: expenseToEdit?.category || route.params?.category || '',
    amount: expenseToEdit?.amount?.toString?.() || '',
    currency: expenseToEdit?.currency || 'EUR',
    receipt: null,
  });

  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // If we are NOT editing an existing expense, reset the form each time this screen is focused
      // (We only reset if there's no expenseToEdit)
      if (!expenseToEdit) {
        setExpense({
          id: undefined,
          title: '',
          description: '',
          category: route.params?.category || '',
          amount: '',
          currency: 'EUR',
          receipt: null,
        });
        console.log(expense)
        setBase64Image(null);
        setIsSuccess(false);
      }
    }, [route.params?.category, expenseToEdit])
  );

  useEffect(() => {
    // Request camera/media permissions
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const imagePickerStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus.status !== 'granted' || imagePickerStatus.status !== 'granted') {
        alert('Sorry, we need camera and photo library permissions to make this work!');
      }
    })();
  }, []);

  // Convert image URI to base64
  const convertToBase64 = async (uri: string): Promise<string | null> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting to base64:', error);
      return null;
    }
  };

  // Image picking logic
  const pickImage = async () => {
    Alert.alert('Upload Receipt', 'Choose an option:', [
      { text: 'Take Photo', onPress: () => openCamera() },
      { text: 'Choose from Gallery', onPress: () => openImageLibrary() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setExpense({ ...expense, receipt: result.assets[0] });
      const base64 = await convertToBase64(uri);
      setBase64Image(base64);
    }
  };

  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setExpense({ ...expense, receipt: result.assets[0] });
      const base64 = await convertToBase64(uri);
      setBase64Image(base64);
    }
  };

  // Generic input handler
  const handleInputChange = (key: keyof ExpenseFormState, value: string) => {
    if (key === 'amount') {
      // Only allow numeric + optional decimal
      if (/^\d*\.?\d*$/.test(value)) {
        setExpense({ ...expense, [key]: value });
      }
    } else {
      setExpense({ ...expense, [key]: value });
    }
  };

  // Submit (POST if new, PATCH if editing)
  const handleSubmit = async () => {
    setIsLoading(true);

    // Construct payload (JSON)
    const payload = {
      title: expense.title,
      description: expense.description,
      category: 'income',
      amount: expense.amount,
      currency: expense.currency,
      image: base64Image,
    };

    try {
      let response;
      if (expenseToEdit) {
        console.log(expenseToEdit.id)
        response = await axios.patch(`${SERVER_URL}/expenses/${expenseToEdit.id}`, payload, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        response = await axios.post(`${SERVER_URL}/expenses`, payload, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
      }
      setIsSuccess(true);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        expenseToEdit
          ? 'There was an issue updating your expense. Please try again.'
          : 'There was an issue creating your expense. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currencyItems = [
    { label: 'Euro', value: 'EUR' },
    { label: 'US Dollar', value: 'USD' },
    { label: 'British Pound', value: 'GBP' },
    { label: 'Japanese Yen', value: 'JPY' },
    { label: 'Canadian Dollar', value: 'CAD' },
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Change title conditionally */}
        <GenericTopBar heightPercentage={9} title={expenseToEdit ? 'Edit Income' : 'New Income'} />
        
        <View style={styles.mainContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#28A745" />
              <Text style={styles.loadingText}>
                {expenseToEdit ? 'Updating Income...' : 'Submitting Income...'}
              </Text>
            </View>
          ) : (
            <Animatable.View
              animation={isSuccess ? 'fadeIn' : undefined}
              duration={2000}
              style={[styles.card, isSuccess && styles.successCard]}
            >
              {isSuccess ? (
                <View>
                  <Animatable.View
                    animation="bounceIn"
                    duration={6000}
                    style={styles.successContainer}
                  >
                    <Icon name="checkmark-circle" size={100} color="#FFF" />
                  </Animatable.View>
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={styles.anotherButton}
                      onPress={() => {
                        // Reset to add another new expense
                        setExpense({
                          id: undefined,
                          title: '',
                          description: '',
                          category: 'income',
                          amount: '',
                          currency: 'EUR',
                          receipt: null,
                        });
                        setBase64Image(null);
                        setIsSuccess(false);
                      }}
                    >
                      <Text style={styles.anotherButtonText}>
                        {expenseToEdit ? 'Edit Another Income' : 'Add Another Income'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.addExpenseButton}
                      onPress={() => navigation.navigate('IncomeStack', { screen: 'IncomeMain' })}
                    >
                      <Text style={styles.anotherButtonText}>View Income</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <Text style={styles.inputLabel}>Title</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Income title"
                    value={expense.title}
                    onChangeText={(text) => handleInputChange('title', text)}
                  />

                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Income description"
                    value={expense.description}
                    onChangeText={(text) => handleInputChange('description', text)}
                  />

                  <View style={styles.inlineContainer}>
                    <View style={styles.amountContainer}>
                      <Text style={styles.inputLabel}>Amount</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Amount"
                        value={expense.amount}
                        keyboardType="numeric"
                        onChangeText={(text) => handleInputChange('amount', text)}
                      />
                    </View>

                    <View style={styles.currencyContainer}>
                      <Text style={styles.inputLabel}>Currency</Text>
                      <View style={styles.pickerWrapper}>
                        <CustomDropdown
                          selectedValue={expense.currency}
                          onValueChange={(value: string) => handleInputChange('currency', value)}
                          items={currencyItems}
                          placeholder="Select Currency"
                          bgColor="#F0F0F0"
                        />
                      </View>
                    </View>
                  </View>

                  <Text style={styles.inputLabel}>Upload Receipt</Text>
                  {expense.receipt ? (
                    <View style={styles.imageContainer}>
                      <Text style={styles.receiptFilename}>{expense.receipt.uri.split('/').pop()}</Text>
                      <TouchableOpacity onPress={pickImage}>
                        <Text style={styles.replaceButtonText}>Replace</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                      <Text style={styles.plusSign}>+</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </Animatable.View>
          )}

          {!isSuccess && !isLoading && (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>
                {expenseToEdit ? 'Update Income' : 'Submit Income'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateIncomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  mainContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  successCard: {
    backgroundColor: '#28A745',
    justifyContent: 'center',
    marginTop: 40,
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    marginTop: 80,
    transform: [{ translateX: -40 }, { translateY: -40 }],
  },
  anotherButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '45%',
  },
  addExpenseButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '45%',
  },
  anotherButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderColor: 'white',
    overflow: 'hidden',
    marginBottom: 15,
  },
  inlineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountContainer: {
    flex: 2,
    marginRight: 20,
  },
  currencyContainer: {
    flex: 1,
  },
  imagePicker: {
    backgroundColor: '#F0F0F0',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  plusSign: {
    fontSize: 40,
    color: '#D3D3D3',
  },
  imageContainer: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  receiptFilename: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  replaceButtonText: {
    fontSize: 16,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  submitButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
  },
});
