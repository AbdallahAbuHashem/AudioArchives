import logo from '../logo.svg';
import '../App.css';
import { Button } from 'antd';
import { AutoComplete } from 'antd';
import React, { useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
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
import SearchFilterOptions from '../Components/SearchFilterOptions.js'

const { Header, Content, Footer } = Layout;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {

    const history = useHistory();
    const handleClick = (str, context) => history.push(`/interview_search_preview?interview=CNN&term=${str}&context=${context}`);

    let query = useQuery();
    const context = query.get('context');
    const term = query.get('term').toLowerCase();
    const [tableData, setTableData] = useState([]);
    const [searchTerm, setSearchTerm] = useState(term);
    const [searchContext, setSearchContext] = useState(context);

    const columns = [
        {
            title: 'File name',
            dataIndex: 'name',
            key: 'name',
            render: text => <Link to={`interview_search_preview?interview=CNN&term=${searchTerm}&context=${searchContext}`}>{text}</Link>,
        },
        {
            title: 'Matches Count',
            dataIndex: 'count',
            key: 'count',
        },
    ];

    useEffect(() => {
        const performSearch = () => {
            let matches_count = 0;
            words.forEach((word_obj) => {
                if (searchContext === "people" && searchTerm === word_obj.speaker_tag) {
                    matches_count += 1
                } else if (searchContext === "text" && searchTerm === word_obj.word.toLowerCase()) {
                    matches_count += 1
                } else if (searchContext === "emotions" && searchTerm === word_obj.emotion.toLowerCase()) {
                    matches_count += 1
                }
            })
            setTableData([{ key: '1', name: 'CNN Obama 2012 Interview', count: matches_count }])
        }
        performSearch()
        // fetch('/upload?file_path=/Users/abdallahabuhashem/CS206/frontend/src&name=new_sound.flac').then
    }, [searchContext, searchTerm])

    return (
        <Layout className="layout">
            <Header>
                <Search initValue={searchTerm} initContext={searchContext} setSearchContext={setSearchContext} setSearchTerm={setSearchTerm}/>
            </Header>
            <Content style={{ padding: '0 50px', flex: 1, marginTop: 50, flexDirection:"column"}}>
              <div style={{alignItems:"center", flex:1, flexDirection:"row", justifyContent:"center"}}>
                <SearchFilterOptions/>
              </div>
              <Table columns={columns} dataSource={tableData} />
            </Content>
        </Layout>
    )
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
