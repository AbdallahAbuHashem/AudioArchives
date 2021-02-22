import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';
import { AutoComplete } from 'antd';
import React, { useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  useHistory,
  useLocation
} from "react-router-dom";

import SearchResults from './Pages/SearchResults'
import InterviewSearchPreview from './Pages/InterviewSearchPreview'
import Upload from './Pages/Upload'

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/search_results">
            <SearchResults />
          </Route>
          <Route path="/interview_search_preview">
            <InterviewSearchPreview />
          </Route>
          <Route path="/upload">
            <Upload />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  const history = useHistory();
  const handleClick = (str, context) => history.push(`/search_results?term=${str}&context=${context}`);
  const [value, setValue] = useState('');
  const [options, setOptions] = useState([]);
  let upload = null;

  const mockVal = (str, list_option = 1) => {
    if (list_option === 1) {
      return {
        value: `Search for ${str} in People`,
      };
    } else if (list_option === 2) {
      return {
        value: `Search for ${str} in Emotions`,
      };
    } else {
      return {
        value: `Search for ${str} in Text`,
      };
    }
  };

  const onSearch = (searchText) => {
    setValue(searchText);
    setOptions(
      !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
    );
  };

  const onSelect = (data, option) => {
    if (data === `Search for ${value} in People`) {
      handleClick(value, 'people');
    } else if (data === `Search for ${value} in Emotions`) {
      handleClick(value, 'emotions');
    } else {
      handleClick(value, 'text');
    }
  };

  const onChange = (data) => {
    setValue(data);
  };

  const onChangeFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      console.log(file)
      const example_name = "test.mp3"
      fetch(`/upload?name=${example_name}&type=${file.type}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: reader.result
      }).then((res) => {
        console.log(res)
      })
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    }
    // this.setState({file}); /// if you want to upload latter
  }

  return (
    <div className="container">
      <input id="myInput"
        type="file"
        ref={(ref) => upload = ref}
        style={{display: 'none'}}
        onChange={onChangeFile}
      />
      <AutoComplete
        options={options}
        style={{
          width: '50%',
        }}
        onSelect={onSelect}
        onSearch={onSearch}
        placeholder="Search your archives"
      />
      <Button
        type="primary"
      >
        <Link to="/upload">Upload</Link>
      </Button>
    </div>
  );
}