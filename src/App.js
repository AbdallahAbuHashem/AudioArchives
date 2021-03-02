import logo from './logo.svg';
import notification from './img/Notification.png';
import './App.css';
import { Button, Layout } from 'antd';
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

const { Header, Footer, Sider, Content } = Layout;

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

  return (
    <Layout className="container">
      <Header className="header-container">
        <div className="header-content">
          <img src={notification} height={40} width={40}/>
        </div>
      </Header>
      <Content>
        <div className="content-container">
          <div className="title" id="main-page-title">
            Audio Archives
          </div>
          <input
            options={options}
            className="autocomplete"
            onSelect={onSelect}
            onSearch={onSearch}
            placeholder="Search your archives"
          />
          <Button
            type="primary"
            className="floating-upload"
          >
            <Link to="/upload" className="button-text">Upload</Link>
          </Button>
        </div>
      </Content>
    </Layout>
  );
}