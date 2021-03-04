import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

TaskManager.defineTask('bgloc', async ({ data, error }) => {
  console.log(data);
});

export default function App() {
  const [selectedImage, setSelectedImage] = React.useState(null);

  useEffect(() => {
    Location.requestPermissionsAsync().then(() => 
        Location.startLocationUpdatesAsync('bgloc', {
          accuracy: Location.Accuracy.High,
          distanceInterval: 100,
          timeInterval: 1000,
          deferredUpdatesInterval: 1000,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
              notificationTitle: 'Repro is fetching your location.',
              notificationBody: 'Please do not remove.'
          },
      })
    )
  },[])

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
  };

  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://i.imgur.com/TkIrScD.png' }} style={styles.logo} />
      <Text style={styles.instructions}>
        To share a photo from your phone with a friend, just press the button below!
      </Text>

      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={styles.buttonText}>Pick a photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  /* Other styles hidden to keep the example brief... */
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  }
});