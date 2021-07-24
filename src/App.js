import React,{useState, useEffect} from 'react'
import {Text,
        View, 
        StyleSheet, 
        TouchableOpacity,
        TextInput,
        StatusBar,
        SafeAreaView,
       } from 'react-native'
import {Picker} from '@react-native-picker/picker'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import Axios from 'axios'
import Snackbar from 'react-native-snackbar'

const App = () => {
  const [users, setUsers] = useState([])
  const [pickedValue, setPickedValue] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  //method to fetch details from api
  fetchDetails =async() =>{
     await fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) =>response.json())
    .then((json) => setUsers(json))
    .catch((error) =>{
      Snackbar.show({
        text:error,
        textColor:'green',
        backgroundColor:'white'
      })
    })
   } 
  useEffect(() =>{
    fetchDetails()
  }, [])

//handling post request
  handleSubmit = () =>{
    if((pickedValue == '' || pickedValue === 'Select User') && (title == '' && body == '')){
      Snackbar.show({
        textColor:'green',
        text:'Please fill all the fields to submit data',
        backgroundColor:'white'
      })
    }else if(title == '' || body == ''){
      Snackbar.show({
        text:'Please fill both the fields',
        textColor:'green',
        backgroundColor:'white'
      })
    }else{
      users.filter((item) => item.name == pickedValue)
           .map((item) => (
              Axios.post('https://jsonplaceholder.typicode.com/posts',{
               UserID: item.id,
               title,
               body
             })
             .then(() => {
        //initializing all fields to it's default values
               setBody('')
               setPickedValue('')
               setTitle('')
             })
             .then(() => {
               alert('UserID :' + `${item.id}` +
                     '   title : ' + `${title}` +
                     '   body : ' + `${body}` +
                     '   Data submitted successfully')
             })
             .catch((error) => {
               Snackbar.show({
                 textColor:'green',
                 text:{error},
                 backgroundColor:'white'
               })
             })
           ))
    }
  }

  return(
    <SafeAreaView style={styles.container}>
    <StatusBar animated={true} backgroundColor='#161616' hidden/>
      {users.length == 0 ? (<Text style={{fontSize:40, color:'green'}}>Loading Data wait</Text>) 
      //conditional rendering: checking if data is fetched and user's array is not empty
        : (
        <View >
          <Text style={styles.heading}>FrontEnd Coding Challenge</Text>
            <Picker selectedValue={pickedValue}
              onValueChange={(itemValue) => setPickedValue(itemValue)}
              style={{backgroundColor:'#5F939A'}}
              itemStyle={{
                color:'white',
                fontSize:18,
                borderRadius:15
              }}          
            >
            <Picker.Item value='Select User' label='Select User' style={styles.pickerStyle}/>
              {users.map((item) => (
              <Picker.Item value={item.name} color='#FFEDA3' style={styles.pickerList} label={item.name} key={item.id}/>
              ))}
            </Picker>
            <View>
              <TextInput  keyboardType='name-phone-pad'
                          placeholder='Enter Title' 
                          placeholderTextColor='#FFEEDB'
                          onChangeText={(text) => setTitle(text)} 
                          style={styles.inputText}
                          value={title}/>
              <TextInput  keyboardType='name-phone-pad' 
                          placeholder='Enter Body' 
                          placeholderTextColor='#FFEEDB'
                          onChangeText={(text) => setBody(text)}
                          value={body}
                          style={styles.inputText}/>
              <TouchableOpacity  style={styles.buttonStyle} onPress={handleSubmit}>
                 <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>

         {pickedValue == '' || pickedValue === 'Select User' ? (
           //displaying map only if user select a value from dropdown picker
          <View style={{backgroundColor:'#161616', height: 250, width:350, top:40}}>
            <Text style={{
              fontSize:30,
              color:'white',
              alignSelf:'center',
              top:100
            }}>Select User to see Map</Text>
          </View>
         ) : (
          <View>
          {users.filter((item) => item.name == pickedValue)
                .map((item) => (
                  <MapView style={{
                    height:250,
                    width:350,
                    top:40
                  }}
                  provider={PROVIDER_GOOGLE}
                  initialRegion = {{
                    latitude: parseFloat(`${item.address.geo.lat}`),
                    longitude: parseFloat(`${item.address.geo.lng}`),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  key={item.id}
                  >
                    <Marker
                      coordinate={{
                        latitude: parseFloat(`${item.address.geo.lat}`),
                        longitude: parseFloat(`${item.address.geo.lng}`), 
                      }}
                      image={require('../assets/pin.png') }
                     
                    ></Marker>
                  </MapView>
                ))
          }
          </View>
         )}
        </View>
          )}
          
      </SafeAreaView>
  )
}

export default App;

//StyleSheet
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#161616',
    alignItems:'center',
    justifyContent:"center"
  },
  heading:{
    fontSize:30,
    alignSelf:'center',
    margin:10,
    color:'#E1E8EB',
    fontWeight:'bold',
    borderBottomWidth:3,
    borderBottomColor:'#CE1212'
  },
  pickerStyle:{
    color:'white',
    fontSize:20, 
  },
  pickerList:{
    fontSize:19
  },
  inputText:{
    fontSize:20,
    color:'#FFBD9B',
    alignSelf:'center',
    borderWidth:3,
    borderColor:'#346751',
    width:'100%',
    height:50,
    margin:6,
    borderRadius:20
  },
  buttonStyle:{
    width:'100%',
    backgroundColor:'#D2EBCD',
    height:45,
    borderRadius:20,
    top:10
  },
  buttonText:{
    fontSize:25,
    fontWeight:'bold',
    alignSelf:'center',
    padding:7,
    color:'#1C1124'
  }
})