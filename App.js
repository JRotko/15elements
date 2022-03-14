import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, } from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from'expo-sqlite';
import { Header,  } from 'react-native-elements';
import { Input, Button, ListItem, Icon } from'react-native-elements'


export default function App() {
  const [product, setProduct] = useState('')
  const [amount, setAmount] = useState('')
  const [products, setProducts] = useState([])
  const db = SQLite.openDatabase('productdb.db');

  const updateList = () => {
     db.transaction(tx => {
      tx.executeSql('select * from products;', [], (_, { rows }) => 
        setProducts(rows._array)  
      )
    }, null, null)
    // setProducts ei toimi kunnolla ilman allaolevaa
    console.log("updated")
  }

  useEffect(() => {
     db.transaction(tx => {
        tx.executeSql('create table if not exists products (id integer primary key not null, product text, amount text);'); 
      }, null, updateList);
    }, []);


  const addProduct = () => {
    db.transaction(tx => {
      tx.executeSql('insert into products (product, amount) values (?, ?);', [product, amount])
    }, null, updateList)
    
  }

  const deleteProduct = (id) => {
    db.transaction(
      tx => {tx.executeSql('delete from products where id = ?;', [id])}, null, updateList
    )

  }

  return (
    <View style={styles.container}>
      <Header 
        centerComponent={{ text: 'SHOPPING LIST'}}
      />
      <View style={styles.up}>
        <Input onChangeText={product => setProduct(product)} placeholder="Type product" value={product} label="PRODUCT"/>
        <Input onChangeText={amount => setAmount(amount)} placeholder="Amount" label="AMOUNT"/>
        <View style={{alignItems: 'center'}}>
          <Button buttonStyle={{width: 250}} rased icon={{name: 'save', color: 'white'}} onPress={addProduct} title="Save" />
        </View>
      </View>
      <View style={styles.down}>
        
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) =>
            <ListItem bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{item.product}</ListItem.Title>  
                <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
              </ListItem.Content>
              <Icon type="material" color="red" name="delete" onPress={() => deleteProduct(item.id)}/>
            </ListItem>
          }
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
    
  },
  input: {
    marginBottom: 10,
    width: 200,
    
  },
  up : {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 40
  },
  down : {
    justifyContent: 'flex-start',
    flex: 3,
  }
});
