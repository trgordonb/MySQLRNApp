import React, { useEffect, useState } from 'react';
import axios from 'axios'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { DataTable } from 'react-native-paper';

const App = () => {
  const [isReady, setIsReady] = useState(false)
  const isDarkMode = useColorScheme() === 'dark';
  const numberOfItemsPerPageList = [10];
  const [items, setItems] = useState([])
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const getData = async () => {
      let total = 0
      let curPage = 1
      let items = []
      do {
        let result = await axios({
          method: 'get',
          url: `https://still-island-47416.herokuapp.com/users?page=${curPage}`
        })
        total = result.data.meta.total
        items.push(...result.data.data)
        curPage = curPage + 1
      }
      while (items.length < total)
      setItems(items)
      setIsReady(true)
    }
    getData()
  },[])

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
            {
              !isReady && <Text style={{margin: 10}}>Loading...</Text>
            }
            <DataTable>
              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
                onPageChange={page => setPage(page)}
                label={`${from + 1}-${to} of ${items.length}`}
                showFastPaginationControls
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={numberOfItemsPerPage}
                onItemsPerPageChange={onItemsPerPageChange}
                selectPageDropdownLabel={'Rows per page'}
              />
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Gender</DataTable.Title>
                <DataTable.Title>Age</DataTable.Title>
                <DataTable.Title>Phone</DataTable.Title>
              </DataTable.Header>
              {
                items.slice(page*numberOfItemsPerPageList, (page+1)*numberOfItemsPerPageList).map((record,idx) => (
                  <DataTable.Row key={idx}>
                    <DataTable.Cell>{record.name}</DataTable.Cell>
                    <DataTable.Cell>{record.gender}</DataTable.Cell>
                    <DataTable.Cell>{record.age}</DataTable.Cell>
                    <DataTable.Cell>{record.phone}</DataTable.Cell>
                  </DataTable.Row>
                ))
              }
            </DataTable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
