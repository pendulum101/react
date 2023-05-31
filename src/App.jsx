import './App.css'
import * as React from 'react';
import PropTypes from "prop-types";
import axios from 'axios';

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
  const [searchTerm, setSearchTerm] = useStorageState(
      'search', '');
  const [url, setUrl] = React.useState(
      `${API_ENDPOINT}${searchTerm}`);
  const [stories, dispatchStories] = React.useReducer(storiesReducer,
      {data: [], isLoading: false, isError: false}
  );

  const handleFetchStories = React.useCallback(async () => {
    try {
      const result = await axios.get(url);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({type: 'STORIES_FETCH_FAILURE'});
    }
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
  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  return (
      <div className="container">
        <h1 className="headline-primary">My Hacker Stories</h1>
        <SearchForm
            searchTerm={searchTerm}
            onSearchInput={handleSearchInput}
            onSearchSubmit={handleSearchSubmit}>
        </SearchForm>

        <div>
          {stories.isError && <p>Something went wrong</p>}

          {stories.isLoading ?
              (<p>Loading...</p>
              ) : (

                  <List list={stories.data}
                        onRemoveItem={handleRemoveStory}/>
              )}
        </div>
      </div>
  );
}
const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit}) => (

<div>
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel id="search"
                    type="text"
                    search={searchTerm}
                    isFocused={false}
                    onInputChange={onSearchInput}>
      Search:
    </InputWithLabel>
    <button type="submit"
            disabled={!searchTerm}>
      Go
    </button>
  </form>
</div>
)
;

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
        <input autoFocus={isFocused}
               id={id}
               type={type}
               value={searchTerm}
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
    <li className="item">
      <span style={{width:'40%'}}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{width:'30%'}}>{item.author}</span>
      <span style={{width:'10%'}}>{item.num_comments}</span>
      <span style={{width:'10%'}}>{item.points}</span>
      <span style={{width:'10%'}}>
        <button type="button" onClick={() => onRemoveItem(item)}
        className="button button_small">
          Remove
        </button>
      </span>
    </li>
);
SearchForm.propTypes = {
  searchTerm: PropTypes.string,
  onSearchInput: PropTypes.func,
  onSearchSubmit: PropTypes.func
}

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