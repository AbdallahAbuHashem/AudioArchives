import '../App.css';
import './SearchBar.css';
import notification from '../img/Notification.png'
import { Layout, Menu, Breadcrumb, Button, Row, Col, Input, InputNumber, Radio } from 'antd';
import React, { useState } from 'react';
import firestore from '../firebase'

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

import Upload from './Upload'
import Browse from './Browse'

const { Header, Content, Footer } = Layout;

export default function SearchBar() {
  return (
    <Router>
      <div>
        <Switch>
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

  const onChange = (e) => {
  }

  const onSearch = (searchText) => {
  };

  const onSelect = (data, option) => {
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