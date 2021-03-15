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
          <ul className="flex-container wrap" style={{maxWidth: '70%'}}>
            {files.map(item => {
              return <InterviewTile item={item}/>
          
            })}
          </ul>
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

const InterviewTile = ({ item }) => {
  const history = useHistory();
  const todayDate = new Date()
  const todayString = `${todayDate.getMonth() + 1}/${todayDate.getDate()}/${todayDate.getFullYear()}`
  return (
    <li className={item.data.status === "Processed" ? "interview-tile interview-clickable" : "interview-tile"} onClick={() => {if (item.data.status === "Processed")history.push(`/finalize_interview_data?key=${item.key}`)}}>
      <div className="interview-tile-upper-container">
        <img src={mic} className="interview-mic" />
        <div className="interview-title"> {item.data.title || item.data.filename} </div>
      </div>
      <div className="interview-tile-lower-container">
        {item.data.status !== "Finished" && (
          <div className={item.data.status === "Processed" ? "interview-status interview-processed" : "interview-status"}> {`Status: ${item.data.status}`} </div>
        )}
        <div className="interview-date"> {item.data.date || todayString} </div>
      </div>
    </li>
  )
}