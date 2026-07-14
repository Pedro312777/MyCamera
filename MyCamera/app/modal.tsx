import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, Camera } from 'expo-camera';
import { ThemedText } from '@/components/themed-text';
import {FontAwesome} from '@expo/vector-icons';
export default function ModalScreen() {

  const camRef = useRef<any>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [type, setType] = useState<'back' | 'front'>('back')
  const [capturedPhoto, setcapturedPhoto] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermissionsAsync();
      setHasPermission(permission.status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <ThemedText>Acesso negado</ThemedText>;
  }

    async function takePicture(){
      if (camRef.current) {
      const data = await camRef.current.takePictureAsync();
      setcapturedPhoto(data.uri)
      setOpen(true)
      }
    }
  return (
    <SafeAreaView style={styles.container}>
      <CameraView  
      style={styles.camera} 
      facing={type} 
      ref={camRef}>
      <View style={styles.contentButtons}>
      <TouchableOpacity 
      style={styles.buttonFlip} 
      onPress={()=>{
        setType(
         type === 'back' ? 'front' : 'back'
         )
      }}>
        <FontAwesome name="exchange" size={23} color="red"/>
        </TouchableOpacity>
        <TouchableOpacity
        style={styles.buttonCamera}
        onPress={takePicture}>
        <FontAwesome name="camera" size={23} color="#fff">

        </FontAwesome>
        </TouchableOpacity>
      </View>
      </CameraView>
      {capturedPhoto &&(
      <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      ><View style={styles.contentModal}>
        <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {setOpen(false)}}
        >
          <FontAwesome name="close" size={50} color="#fff"> </FontAwesome>
        </TouchableOpacity>
          
            <Image style={styles.imgPhoto} source={{uri: capturedPhoto}}/>
          </View>
      </Modal>
    )}
    </SafeAreaView> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  contentButtons:{
    flex:1,
    backgroundColor:"transparent",
    flexDirection:"row",
  },
  buttonFlip:{
    position:"absolute",
    bottom:50,
    left:30,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#fff",
    margin:20,
    height:50,
    width:50,
    borderRadius:50,
  },
  buttonCamera:{
     position:"absolute",
    bottom:50,
    right:30,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"red",
    margin:20,
    height:50,
    width:50,
    borderRadius:50,
  },
  contentModal:{
    flex:1,
    justifyContent:"center",
    alignItems:"flex-end",
    margin:20,
  },
  closeButton:{
    position:"absolute",
    top: 10,
    left: 2,
    margin: 10,
  },
  imgPhoto:{
    width:"100%",
    height: 400,
  }
});
