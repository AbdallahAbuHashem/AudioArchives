import '../App.css';
import './Browse.css';
import notification from '../img/Notification.png';
import mic from '../img/Mic.png';
import { Button, Layout } from 'antd';
import { AutoComplete } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import firestore from '../firebase';


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

import InterviewSearchPreview from './InterviewSearchPreview'
import Upload from './Upload'
import App from '../App'

const { Header, Footer, Sider, Content } = Layout;

export default function Browse() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/interview_search_preview">
            <InterviewSearchPreview />
          </Route>
          <Route path="/upload">
            <Upload />
          </Route>
          <Route path="/search">
            <App />
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
        newFiles.push(doc.data())
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
            <div className="header-links-selected">Browse</div>
            <Link to="/search" className="header-links">Search</Link>
            <Link to="/upload" className="header-links">Upload</Link>
          </div>
          <img src={notification} height={40} width={40}/>
        </div>
      </Header>
      <Content>
        <div className="content-container">
          <div className="title" id="main-page-title">
            Browse
          </div>
          <ul className="flex-container wrap" style={{maxWidth: '70%'}}>
            {files.map(item => <InterviewTile item={item} />)}
          </ul>
        </div>
      </Content>
    </Layout>
  );
}

const InterviewTile = ({ item }) => {
  const todayDate = new Date()
  const todayString = `${todayDate.getMonth() + 1}/${todayDate.getDate()}/${todayDate.getFullYear()}`
  return (
    <li className="interview-tile">
      <div className="interview-tile-upper-container">
        <img src={mic} className="interview-mic" />
        <div className="interview-title"> {item.title || item.filename} </div>
      </div>
      <div className="interview-tile-lower-container">
        <div className={item.status === "Processed" ? "interview-status interview-processed" : "interview-status"}> {`Status: ${item.status}`} </div>
        <div className="interview-date"> {item.data || todayString} </div>
      </div>
    </li>
  )
}