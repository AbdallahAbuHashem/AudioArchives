import logo from '../logo.svg';
import '../App.css';
import { Alert, Button } from 'antd';
import { AutoComplete } from 'antd';
import { Layout, Menu, Breadcrumb, Typography } from 'antd';
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
import { words } from "../example_data";
import { Table, Tag, Space } from 'antd';

const { Text } = Typography;

const { Header, Content, Footer } = Layout;
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function InterviewSearchPreview() {
    let query = useQuery();
    const context = query.get('context');
    const term = query.get('term').toLowerCase();
    let speaker = 1;
    let audio = null;

    return (
        <Layout className="layout">
            <Header>
                <Search initValue={term} initContext={context} />
            </Header>
            <Content style={{ padding: '0 50px', flex: 1, marginTop: 50 }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Search</Breadcrumb.Item>
                    <Breadcrumb.Item>Search Results</Breadcrumb.Item>
                    <Breadcrumb.Item>CNN Obama 2012 Interview</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div>
                        <Text className="clickable-text" onClick={() => audio.audioEl.current.currentTime = words[0].start_time}>Speaker 1: </Text>
                        {words.map((wordObj) => {
                            let val = null;
                            if (context === "people" && term === wordObj.speaker_tag) {
                                val = (
                                    <Text className="clickable-text" mark onClick={() => audio.audioEl.current.currentTime = wordObj.start_time - 1 > 0 ? wordObj.start_time - 1 : 0}>{wordObj.word} </Text>
                                )
                            } else if (context === "text" && term === wordObj.word.toLowerCase()) {
                                val = (
                                    <Text className="clickable-text" mark onClick={() => audio.audioEl.current.currentTime = wordObj.start_time - 1 > 0 ? wordObj.start_time - 1 : 0}>{wordObj.word} </Text>
                                )
                            } else if (context === "emotions" && term === wordObj.emotion.toLowerCase()) {
                                val = (
                                    <Text className="clickable-text" mark onClick={() => audio.audioEl.current.currentTime = wordObj.start_time - 1 > 0 ? wordObj.start_time - 1 : 0}>{wordObj.word} </Text>
                                )
                            } else {
                                val = (
                                    <Text className="clickable-text" onClick={() => audio.audioEl.current.currentTime = wordObj.start_time - 1 > 0 ? wordObj.start_time - 1 : 0}>{wordObj.word} </Text>
                                )
                            }
                            if (speaker !== wordObj.speaker_tag) {
                                speaker = wordObj.speaker_tag;
                                return (
                                    <> 
                                        <br />
                                        <Text className="clickable-text" onClick={() => audio.audioEl.current.currentTime = wordObj.start_time - 1 > 0 ? wordObj.start_time - 1 : 0}> Speaker {speaker}: </Text>
                                        {val}
                                    </>
                                )
                            } else {
                                return val
                            }
                        })}
                    </div>
                    <ReactAudioPlayer
                        style={{marginTop: 20}}
                        ref={(element) => { audio = element; }}
                        src="https://storage.googleapis.com/audio-bucket-206/test_interview.mp3"
                        controls
                    />
                </div>
            </Content>
        </Layout>
    );
}

function Search({ initValue, initContext, setSearchContext, setSearchTerm }) {
    const history = useHistory();
    const handleClick = (str, context) => history.push(`/search_results?term=${str}&context=${context}`);
    const [value, setValue] = useState(`Search for ${initValue} in ${initContext}`);
    const [options, setOptions] = useState([]);
  
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
        setSearchContext('people');
        setValue(`Search for ${value} in people`);
      } else if (data === `Search for ${value} in Emotions`) {
        setSearchContext('emotions');
        setValue(`Search for ${value} in emotions`);
      } else {
        setSearchContext('text');
        setValue(`Search for ${value} in text`);
      }
      setSearchTerm(value);
    };
  
    const onChange = (data) => {
      setValue(data);
    };
  
    return (
      <>
        <AutoComplete
          options={options}
          style={{
            width: '50%',
          }}
          onSelect={onSelect}
          onSearch={onSearch}
          value={value}
          placeholder="Search your archives"
        />
      </>
    );
  }