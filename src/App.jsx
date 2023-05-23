import './App.css'
import * as React from 'react';
import PropTypes from "prop-types";
import App_Button from "./App_Button.jsx";

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
      localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {
  const stories = [{
    title: "React",
    url: "http://test.org",
    author: "ME",
    num_comments: 3,
    lang: "EN",
    objectID: 0
  },
    {
      title: "Vue",
      url: "http://wikid.org",
      author: "You",
      num_comments: 10,
      lang: "DE",
      objectID: 1
    },
  ];

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(function (story) {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
      <div>
        <InputWithLabel id="search"
                        label="Search"
                        type="text"
                        search={searchTerm}
                        onInputChange={handleSearch}/>
        <List list={searchedStories}/>
        <App_Button></App_Button>
      </div>
  );
}

const InputWithLabel = ({id, label, search, onInputChange, type}) => {

  return (
      <div>
        <label htmlFor={id}>{label}</label>
        &nbsp;
        <input id={id} type={type} value={search} onChange={onInputChange}/>
      </div>
  );
}

// const handleSearch = (event) => {
//   console.log(event.target.value);
// }

const List = ({list}) => (
    <ul>
      {/* eslint-disable-next-line react/prop-types */}
      {list.map((item) => (
          <Item key={item.objectID} item={item}/>
      ))}
    </ul>
);

const Item = ({item}) => (
    <li>
      <span> {item.title}</span>
      <span> {item.url}</span>
      <span> {item.author}</span>
      <span> {item.num_comments}</span>
    </li>
);
//
// import React from 'react';
//
//
// event Callback example
// function App() {
//   const [text, setText] = React.useState('');
//
//   // 1
//   function handleTextChange(event) {
//     setText(event.target.value); // 3
//   }
//
//   return (
//       <div>
//         <MyInput inputValue={text} onInputChange={handleTextChange} />
//
//         {text}
//       </div>
//   );
// }
//
// // 2
// function MyInput({ inputValue, onInputChange }) {
//   return (
//       <input type="text" value={inputValue} onChange={onInputChange} />
//   );
// }

InputWithLabel.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  search: PropTypes.string,
  onInputChange: PropTypes.func
}

Item.propTypes = {
  item: PropTypes.object
}

List.propTypes = {
  list: PropTypes.array
}
export default App