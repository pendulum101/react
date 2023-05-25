import './App.css'
import * as React from 'react';
import PropTypes from "prop-types";

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
            (story) => action.payload.objectID !== story.objectID
        ),
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
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
  const [stories, dispatchStories] = React.useReducer(storiesReducer,
      {data: [], isLoading: false, isError: false}
  );

  React.useEffect(() => {
    if (!searchTerm) {
      return;
    }

    dispatchStories({type: 'STORIES_FETCH_INIT'});

    fetch(`${API_ENDPOINT}${searchTerm}`)
    .then((response) => response.json())
    .then((result) => {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.hits,
      });
    }).catch(() => dispatchStories({type: 'STORIES_FETCH_FAILURE'}));
  }, [searchTerm]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

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
          {stories.isError && <p>Something went wrong</p>}

          {stories.isLoading ?
              (<p>Loading...</p>
              ) : (

                  <List list={stories.data}
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