import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

// Pre-step, call this before any NFC operations
NfcManager.start();

const HomeScreen: React.FC = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  async function readNdef() {
    setIsScanning(true);
    setScanResult(null);
    try {
      // Register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // The resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      setScanResult(JSON.stringify(tag));
      console.log(JSON.stringify(tag))
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // Stop the NFC scanning
      NfcManager.cancelTechnologyRequest();
      setIsScanning(false);
    }
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>NFC Scanner</Text>
      <TouchableOpacity style={styles.button} onPress={readNdef} disabled={isScanning}>
        <Text style={styles.buttonText}>{isScanning ? 'Scanning...' : 'Scan a Tag'}</Text>
      </TouchableOpacity>
      {isScanning && <ActivityIndicator size="large" color="#0000ff" />}
      {scanResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Scan Result:</Text>
          <Text style={styles.resultText}>{scanResult}</Text>
        </View>
      )}
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
