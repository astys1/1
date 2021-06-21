import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Platform, 
  StyleSheet, 
  Text, 
  Dimensions,
  SafeAreaView, 
  Button,  
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  View } from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton, Colors } from 'react-native-paper';
import Pdf from 'react-native-pdf';


function PdfScreen({ navigation }) { //  pdf 
  
 const source = {uri:'http://samples.leanpub.com/thereactnativebook-sample.pdf',cache:true};
  

  return (
    <View style={styles.container}>
      <Pdf/>
    </View>
  )
  
  
}

function СoursebooksScreen({ route, navigation }) { //  книги в курсе 
  const [books, setBooks] = useState([]);
  const { query } = route.params;
  console.log(query);

  useEffect( () => {
    const fetchData = async () => {
      const result = await axios(
        'https://astys1.github.io/MyBook/book.json',
      );
 
      setBooks(result.data.filter(b => b.course === query));
    };
 
    fetchData();
  },[query])

  return (
    <ScrollView style={styles.scrollView}>
      <View >
      { books.map(b => (
          <View key={b.name}>
             <TouchableOpacity style={styles.book} onPress={() => Linking.openURL(b.url)}>
             <Image  style={{width: 100, height: 150, margin: 0, borderRadius: 15 }} source={{ uri: b.img}}></Image>
                <View style={styles.title}> 
                  <Text style={styles.name}>{b.name}</Text>
                  <Text style={styles.author}>{b.author}</Text>
                </View> 
             </TouchableOpacity>
          </View>
        ))}
      </View>
      </ScrollView>
  );
}

function CoursesScreen({ navigation }) { // экран курсов
  
  const [сourses, setCourses] = useState([]);

  useEffect( () => {
    const fetchData = async () => {
      const result = await axios(
        'https://astys1.github.io/MyBook/courses.json',
      );
 
      setCourses(result.data);
    };
    fetchData();
  },[])

  return (
    <ScrollView style={styles.scrollView}>
      <View  style={styles.coursepalet}>
        { сourses.map(с => (
          <TouchableOpacity   style={styles.course} key={с.name} onPress={() => navigation.navigate('Книги курсу', { query: с.name })}>
              <Image   style={{width: 157, height: 157, margin: 6, marginBottom: 0,}}   source={{ uri: с.img}}></Image>
              <Text style={{margin: 4}}>{с.name}</Text>
          </TouchableOpacity>  
          
        ))} 
      </View>
    </ScrollView>
  );
}

function BooksScreen({ navigation }) {  // экран книг 
  const [books, setBooks] = useState([]);

  useEffect( () => {
    const fetchData = async () => {
      const result = await axios(
        'https://astys1.github.io/MyBook/book.json',
      );
 
      setBooks(result.data);
    };
 
    fetchData();
  },[])

  return (
    <ScrollView style={styles.scrollView}>
      <View >
      { books.map(b => (
          <View key={b.name}>
             <TouchableOpacity style={styles.book} onPress={() => Linking.openURL(b.url)}>
                <Image  style={{width: 100, height: 150, margin: 0, borderRadius: 15 }} source={{ uri: b.img}}></Image>
                <View style={styles.title}> 
                  <Text style={styles.name}>{b.name}</Text>
                  <Text style={styles.author}>{b.author}</Text>
                </View> 
             </TouchableOpacity>
          </View>
        ))}
      </View>
      </ScrollView>
  );
}

const PdfStack = createStackNavigator();

const CoursesStack = createStackNavigator();

function CoursesStackScreen() {     // шапка курсов
  return (
    <CoursesStack.Navigator
    screenOptions={{
        headerStyle: { backgroundColor: "#708090"}
    }}
    >
      <CoursesStack.Screen name="Курси"  component={CoursesScreen}  options={{  headerTintColor: '#ffffff',
        headerRight: () => (
          <IconButton
            icon="information"
            color="#ffffff"
            size={24}
            onPress={_Alert}
          />
        ),
      }}/>
      <CoursesStack.Screen name="Книги курсу"  component={СoursebooksScreen} options={{ headerTintColor: '#ffffff'}}/>
      <PdfStack.Screen name="Pdf" component={PdfScreen} />
    </CoursesStack.Navigator>
  );
}

const BooksStack = createStackNavigator();

function BooksStackScreen() {         // шапка книг
  return (
    <BooksStack.Navigator
      screenOptions={{
      headerStyle: { backgroundColor: "#708090"}
      
  }}
    >
      <BooksStack.Screen name="Книги" component={BooksScreen} 
        options={{ headerTintColor: '#ffffff',
            headerRight: () =>  (
              <IconButton
                icon="information"
                color="#ffffff"
                size={24}
                onPress={_Alert}
              />
            ),
          }}/>
    </BooksStack.Navigator>
  );
}

const _Alert = () =>
  Alert.alert(
    "Про додаток",
    "Дипломний прєкт Виконали студентки групи КС-1-17  Байкалова А. О., Пуліна О. О.",
      
    [
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]
    );

const Tab = createBottomTabNavigator();

export default function App() {
  return ( // навгация внизу 
    <NavigationContainer>    
      <Tab.Navigator            
        tabBarOptions={{
          style: { backgroundColor: "#708090"}
        }}
      >
        <Tab.Screen name="Курси" component={CoursesStackScreen} options={{
          tabBarIcon: () => <AntDesign name="inbox" size={24} color="#FFF"  />
        }} />
        <Tab.Screen name="Книги"  component={BooksStackScreen} options={{
          tabBarIcon: () => <AntDesign name="book" size={24} color="#FFF"  />
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({   // стили
 
  book:{
    backgroundColor: '#ffffff',
    borderRadius: 15,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    
  },
  title:{
    flexWrap: "wrap"
  },

  coursepalet:{ 
    flex: 1, 
    justifyContent: 'space-around', 
    alignItems: 'baseline',
    
    flexDirection: "row",
    flexWrap: "wrap"
  },
  courseimg: {
    width: 157,
    height: 157,
    margin: 6,
    marginBottom: 0,
  },
  course:{
    backgroundColor: '#ffffff',
    borderRadius: 15,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  name:{
    margin: 8, 
    width: 240,
  },

  author:{
    margin: 8, 
    
  },
  img:{
    width: 100, 
    height: 150, 
    margin: 0,
    borderRadius: 15, 
    
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width
  },


});