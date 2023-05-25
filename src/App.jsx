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
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);
  const [stories, dispatchStories] = React.useReducer(storiesReducer,
      {data: [], isLoading: false, isError: false}
  );

  const handleFetchStories = React.useCallback(() => {
    if (!searchTerm) {
      return;
    }

    dispatchStories({type: 'STORIES_FETCH_INIT'});

    fetch(url)
    .then((response) => response.json())
    .then((result) => {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.hits,
      });
    }).catch(() => dispatchStories({type: 'STORIES_FETCH_FAILURE'}));
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  return (
      <>
        <div><InputWithLabel id="search"
                             type="text"
                             search={searchTerm}
                             isFocused={false}
                             onInputChange={handleSearchInput}>
          Search:
        </InputWithLabel>
          <button type="button"
                  onClick={handleSearchSubmit}
                  disabled={!searchTerm}>
            Go
          </button>
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
  searchTerm,
  onInputChange,
  type,
  children
}) => {

  return (
      <div>
        <label htmlFor={id}>{children}</label>
        &nbsp;
        <input autoFocus={isFocused} id={id} type={type} value={searchTerm} onChange={onInputChange}/>
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
  searchTerm: PropTypes.string,
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