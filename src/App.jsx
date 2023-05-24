import './App.css'
import * as React from 'react';
import PropTypes from "prop-types";

const getAsyncStories = () => new Promise(
    (resolve) =>
        setTimeout(() => resolve({data: {stories: initialStories}}),
            1000
        )
);

const initialStories = [{
  title: "React",
  url: "http://test.org",
  author: "ME",
  num_comments: 3,
  lang: "EN",
  objectID: 0
},
  {
    title: "Vue",
    url: "http://wiki.org",
    author: "You",
    num_comments: 10,
    lang: "DE",
    objectID: 1
  }
];

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STORIES':
      return action.payload;
    case 'REMOVE_STORY':
      return state.filter(
          (story) => action.payload.objectID !== story.objectID
      );
    default:
      throw new Error();
  }
};

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
  const [searchTerm, setSearchTerm] = useStorageState('search', '');
  const [stories, dispatchStories] = React.useReducer(storiesReducer, []);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);

    getAsyncStories().then((result) => {
      dispatchStories({
        type: 'SET_STORIES',
        payload: result.data.stories,
      });
      setIsLoading(false);
    }).catch(() => setIsError(true));
  }, []);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <>
        <div><InputWithLabel id="search"
                             type="text"
                             search={searchTerm}
                             isFocused={false}
                             onInputChange={handleSearch}>
          Search:
        </InputWithLabel>
        </div>

        <div>
          {isError && <p>Something went wrong</p>}

          {isLoading ?
              (<p>Loading...</p>
              ) : (

                  <List list={searchedStories}
                        onRemoveItem={handleRemoveStory}/>
              )}
        </div>
      </>
  );
}

const InputWithLabel = ({
  id,
  isFocused,
  search,
  onInputChange,
  type,
  children
}) => {

  return (
      <div>
        <label htmlFor={id}>{children}</label>
        &nbsp;
        <input autoFocus={isFocused} id={id} type={type} value={search}
               onChange={onInputChange}/>
      </div>
  );
}

const List = ({list, onRemoveItem}) => (
    <ul>
      {list.map((item) => (
          <Item key={item.objectID}
                item={item}
                onRemoveItem={onRemoveItem}/>
      ))}
    </ul>
);

const Item = ({item, onRemoveItem}) => (
    <li>
      <span> {item.title}</span>
      <span> {item.url}</span>
      <span> {item.author}</span>
      <span> {item.num_comments}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Remove
        </button>
      </span>
    </li>
);

InputWithLabel.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  search: PropTypes.string,
  onInputChange: PropTypes.func,
  children: PropTypes.string,
  isFocused: PropTypes.bool
}

Item.propTypes = {
  item: PropTypes.object,
  onRemoveItem: PropTypes.func
}

List.propTypes = {
  list: PropTypes.array,
  onRemoveItem: PropTypes.func
}
export default App