import logo from './logo.svg';
import notification from './img/Notification.png';
import mic from './img/Mic.png';
import './App.css';
import { Button, Layout } from 'antd';
import { AutoComplete } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import firestore from './firebase';

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
import FinalizeInterviewData from './Pages/FinalizeInterviewData'
import Upload from './Pages/Upload'
import Browse from './Pages/Browse'

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
          <Route path="/finalize_interview_data">
            <FinalizeInterviewData />
          </Route>
          <Route path="/upload">
            <Upload />
          </Route>
          <Route path="/browse">
            <Browse />
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
  const [files, setFiles] = useState([]);
  let upload = null;

  useEffect(() => {
    firestore.collection('audioarchives').onSnapshot((docs) => {
      let newFiles = []
      docs.forEach((doc) => {
        newFiles.push({data: doc.data(), key: doc.id})
      })
      setFiles(newFiles)
    })
  },[])
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
          <div className="nav-links">
            <Link to="/browse" className="header-links">Browse</Link>
            <div className="header-links-selected">Search</div>
            <Link to="/upload" className="header-links">Upload</Link>
          </div>
          <img src={notification} height={40} width={40}/>
        </div>
      </Header>
      <Content>
        <div className="content-container">
          <div className="title" id="main-page-title">
            Audio Archives
          </div>
          <div className="search-area">
            <input
            options={options}
            className="autocomplete"
            onSelect={onSelect}
            onSearch={onSearch}
            placeholder="Search your archives"
          />
          <div className="space"></div>
          <Button
            type="primary"
            className="search-button"
          >Search
          </Button>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
