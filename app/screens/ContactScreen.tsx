import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  Alert,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

import GenericTopBar from "../components/GenericTopBar";
import CustomDropdown from "../components/CustomDropdown";
import CustomButton from "../components/CustomButton";

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
  user: User;
  setUser: (user: User | null) => void;
};

const ContactScreen: React.FC<Props> = ({  }) => {
  const issueOptions = [
    { label: "I am having issues with my accounting.", value: "accountingIssue", email: "kylesullivan2323@gmail.com" },
    { label: "I found a bug!", value: "techSupport", email: "sullivanlouis0@gmail.com" },
    { label: "I want am requesting a new feature.", value: "featureReq", email: "sullivanlouis0@gmail.com" },
    { label: "I have a general inquiry", value: "generalInquiry", email: "kylesullivan2323@gmail.com" },
  ];

  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [issueDescription, setIssueDescription] = useState("");

  const handleSubmit = () => {
    if (!selectedIssue) {
      Alert.alert("Please select an issue first.");
      return;
    }

    const chosen = issueOptions.find((item) => item.value === selectedIssue);
    if (chosen) {
      const mailToUrl = `mailto:${chosen.email}?subject=${encodeURIComponent(
        chosen.label
      )}&body=${encodeURIComponent(issueDescription)}`;

      Linking.openURL(mailToUrl).catch((err) => {
        console.error("Failed to open email client:", err);
      });
      setIssueDescription("");
      setSelectedIssue(null);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <GenericTopBar heightPercentage={9} title="Contact Us" />
        <View style={styles.issuecontainer}>
            <Text style={styles.sectionTitle}>Issue Type</Text>
            
            <View style={styles.pickerWrapper}>
                <CustomDropdown
                selectedValue={selectedIssue}
                onValueChange={(value: string) => setSelectedIssue(value)}
                items={issueOptions}
                placeholder="Select an issue..."
                bgColor='white'
                />
            </View>

            <Text style={styles.sectionTitle}>Issue Description</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Describe your issue here..."
                multiline
                value={issueDescription}
                onChangeText={(text) => setIssueDescription(text)}
            />

            <View style={styles.buttonContainer}>
                <CustomButton 
                    title="Send!" 
                    onPress={() => handleSubmit()}
                    fontSize={15} 
                    backgroundColor='#28A745' 
                    fontColor='white' 
                />
            </View>

            
            <View style={styles.assistanceContainer}>
                <Text style={styles.assistanceText}>Need further assistance?</Text>
                <Text style={styles.assistanceText}>Kyle Sullivan, Owner & Accountant</Text>
                <TouchableWithoutFeedback onPress={() => Linking.openURL("tel:+353830529752")}>
                    <Text style={[styles.assistanceText, { color: "blue", textDecorationLine: "underline" }]}>
                    +353 (83) 052 9752
                    </Text>
                </TouchableWithoutFeedback>
            </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  issuecontainer: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  pickerWrapper: {
    borderColor: 'white',
    overflow: 'hidden',
    marginBottom: 15,
  },
  textInput: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 8,
    height: 200,
    textAlignVertical: "top",
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    },  
  assistanceContainer: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 16,
  },
  assistanceText: {
    fontSize: 14,
    marginVertical: 2,
  },
});
