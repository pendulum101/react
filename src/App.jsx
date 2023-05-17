import './App.css'
import * as React from 'react';

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

  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(function (story) {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
      <div>
        <Search onSearch={handleSearch}/>
        <List list={searchedStories}/>
      </div>
  );
}

const Search = (props) => {
  return (
      <div>
        <label htmlFor="search"> Search: </label>
        {/* eslint-disable-next-line react/prop-types */}
        <input id="search" type="text" onChange={props.onSearch}/>
        {/*<p>Searching for: <strong>{searchTerm}</strong></p>*/}
      </div>
  );
}

// const handleSearch = (event) => {
//   console.log(event.target.value);
// }

const List = (props) => (
    <ul>
      {/* eslint-disable-next-line react/prop-types */}
      {props.list.map((item) => (
          <Item key={item.objectID} item={item}/>
      ))}
    </ul>
);

const Item = (props) => (
    <li>
      <span>{props.item.title}</span>
      <span> {props.item.url}</span>
      <span> {props.item.author}</span>
      <span> {props.item.num_comments}</span>
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

export default App