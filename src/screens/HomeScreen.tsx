import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { Buffer } from 'buffer'; // Import Buffer from the buffer library

const HomeScreen = () => {
  const [nfcData, setNfcData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    NfcManager.start();
    return () => {
      NfcManager.stop();
    };
  }, []);

  const parseNestedTLV = (hex: string) => {
    let index = 0;
    const results: Record<string, string> = {};

    while (index < hex.length) {
      const tag = hex.substring(index, index + 2);
      const length = parseInt(hex.substring(index + 2, index + 4), 16);
      const value = hex.substring(index + 4, index + 4 + length * 2);

      results[tag] = value;
      index += 4 + length * 2;
    }

    return results;
  };

  const heuristicExtract = (hex: string) => {
    const possibleCardNumber = hex.match(/\b\d{12,19}\b/); // Looks for 12-19 consecutive digits
    const possibleExpirationDate = hex.match(/\b\d{4}\b/); // YYMM or MMYY
    return {
      cardNumber: possibleCardNumber ? possibleCardNumber[0] : '',
      expirationDate: possibleExpirationDate ? possibleExpirationDate[0] : '',
    };
  };

  const hexToAscii = (hex: string) => {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      const charCode = parseInt(hex.substring(i, i + 2), 16);
      str += String.fromCharCode(charCode);
    }
    return str;
  };

  const debugDataPatterns = (data: string) => {
    const asciiData = hexToAscii(data);
    console.log("ASCII Representation:", asciiData);

    // Look for numerical patterns (e.g., 16 consecutive digits for a card number)
    const possibleCardNumber = data.match(/\d{12,19}/); // Searches for 12-19 consecutive digits
    console.log("Possible Card Number:", possibleCardNumber ? possibleCardNumber[0] : 'None');

    // Search for recognizable date patterns (e.g., YYMM or MMYY)
    const possibleDate = data.match(/(0[1-9]|1[0-2])\d{2}/); // Typical MMYY pattern
    console.log("Possible Expiration Date:", possibleDate ? possibleDate[0] : 'None');
  };

  const parseIsoDepData = (data: number[]) => {
    const hexString = data.map(byte => byte.toString(16).padStart(2, '0')).join('');
    console.log("Hex String:", hexString);

    const applicationTemplate = parseSubStructure('6f', hexString);
    const fileControlInformation = applicationTemplate ? parseSubStructure('a5', applicationTemplate) : null;

    if (fileControlInformation) {
      console.log("Deep Parsing A5 Structure:", fileControlInformation);

      // Step 1: Try nested TLV parsing
      const parsedNestedTLV = parseNestedTLV(fileControlInformation);
      console.log("Parsed Nested TLV:", parsedNestedTLV);

      // Step 2: Heuristic extraction from raw hex data
      const heuristicData = heuristicExtract(fileControlInformation);
      console.log("Heuristic Extraction:", heuristicData);

      // Debug data patterns for potential card details
      debugDataPatterns(fileControlInformation);

      // Output parsed values
      return {
        cardNumber: parsedNestedTLV['5A'] || heuristicData.cardNumber || '',
        expirationDate: parsedNestedTLV['5F24'] || heuristicData.expirationDate || '',
        name: parsedNestedTLV['5F20'] || '',
      };
    }

    console.log("Card details could not be extracted");
    return { cardNumber: '', expirationDate: '', name: '' };
  };

  // Helper function to parse sub-structures
  function parseSubStructure(tag: string, hex: string) {
    const index = hex.indexOf(tag);
    if (index !== -1) {
      const lengthIndex = index + tag.length;
      const length = parseInt(hex.substring(lengthIndex, lengthIndex + 2), 16);
      const contentStartIndex = lengthIndex + 2;
      return hex.substring(contentStartIndex, contentStartIndex + length * 2);
    }
    return null;
  }

  const readNFC = async () => {
    setIsScanning(true);
    setNfcData(null);

    try {
      await NfcManager.requestTechnology([NfcTech.IsoDep]);
      const selectApdu = [0x00, 0xA4, 0x04, 0x00]; // Example APDU, may need adjustment
      const response = await NfcManager.transceive(selectApdu);
      const hexString = response.map(byte => byte.toString(16).padStart(2, '0')).join('');
      console.log("IsoDep Data (Hex):", hexString);

      // Assuming you retrieve ISO-7816 encoded data, parse it here
      const cardDetails = parseIsoDepData(response);
      Alert.alert("Card Data", `Card Number: ${cardDetails.cardNumber}\nExpiration: ${cardDetails.expirationDate}\nName: ${cardDetails.name}`);

      setNfcData(`Card Data:\nCard Number: ${cardDetails.cardNumber}\nExpiration: ${cardDetails.expirationDate}\nName: ${cardDetails.name}`);
    } catch (error) {
      console.warn("NFC read error:", error);
      setNfcData(`Error: ${error.message || 'An unexpected error occurred'}`);
    } finally {
      NfcManager.cancelTechnologyRequest();
      setIsScanning(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>NFC Data:</Text>
      <Text>{nfcData || "No data scanned"}</Text>
      <Button title="Scan NFC" onPress={readNFC} disabled={isScanning} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
});

export default HomeScreen;
