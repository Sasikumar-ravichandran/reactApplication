import Header from './Header';
import SearchItem from './SearchItem';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import apiRequest from './apiRequest'



function App() {
  const API_URL = 'http://localhost:3500/items'
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('')
  const [search, setSearch] = useState('')
  const [fetchError, setFectError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {


    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) throw Error('Did not recive expected data')
        const listItem = await response.json()
        console.log(listItem);
        setFectError(null)
        setItems(listItem)
      } catch (e) {
        setFectError(e.message)
      } finally {
        setIsLoading(false)
      }

    }
    setTimeout(() => {
      (async () => await fetchItems())()
    }, 2000);

  }, [])

  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = { id, checked: false, item };
    console.log(myNewItem, 'aaa')
    const listItems = [...items, myNewItem];
    setItems(listItems);


    const postMethod = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(myNewItem)
    }

    const result = await apiRequest(API_URL, postMethod)
    if (result) setFectError(result)
  }

  const handleCheck = async (id) => {
    const listItems = items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item);
    setItems(listItems);

    const myItems = listItems.filter((item) => item.id === id)
    const patchMethod = {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ checked: myItems[0].checked })
    }

    const result = await apiRequest(API_URL + '/' + id, patchMethod)
    if (result) setFectError(result)
  }

  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);

    const deleteMethod = {
      method: 'DELETE',
    }

    const result = await apiRequest(API_URL + '/' + id, deleteMethod)
    if (result) setFectError(result)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    console.log(newItem, 'sss')
    addItem(newItem);
    setNewItem('');
  }

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem
        search={search}
        setSearch={setSearch}
      />
      <main>
        {isLoading && <p>loading...</p>}
        {fetchError && <p style={{ color: 'red' }}>{`Error ${fetchError}`}</p>}
        {!fetchError && !isLoading && <Content
          items={items.filter(item => (item.item).toLowerCase().includes(search.toLowerCase()))}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />
        }
      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;