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
import SearchFilterOptions from './Components/SearchFilterOptions.js'

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
  const [searchInput, setSearchInput] = useState('');
  const [searchStr, setSearchStr] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [clips, setClips] = useState([]);

  const [sortedIds, setSortedIds] = useState([]); // will contain the final sorted list of clip ID's

  var processedClips = [];
  var searchResults = []; // will contain indices to the clips that will be returned to the user, sorted by relevance
  let unigrams = new Map(); //map of words to their frequencies
  let bigrams = new Map(); //map of pairs of words to their frequencies

  useEffect(() => {
    firestore.collection('audioarchives').onSnapshot((docs) => {
      let newFiles = []
      docs.forEach((doc) => {
        newFiles.push(doc.data())
      })
      setClips(newFiles)
    })
  },[])

  useEffect(() => {
    setSearchStr(searchInput.toLowerCase().split(" "));
  },[searchInput])

  const computeFrequencies = async () => {
    for (const clip of clips) {
      if (clip.status == "Processed" || clip.status == "Finished") {
        var unigram_frequencies = new Map();
        var bigram_frequencies = new Map();

        var response = await fetch(clip.jsonLink)
        var data = await response.json()
        var transcript = data["output"]
        for (let i = 0; i < transcript.length; i++) {
            let word = transcript[i]["word"].toLowerCase();
            if (unigram_frequencies.has(word)) {
                unigram_frequencies.set(word, unigram_frequencies.get(word) + 1);
            } else {
                unigram_frequencies.set(word, 1);
            }
            if (i > 0) { //calculate bigram frequencies
                var bigram = transcript[i-1]["word"].toLowerCase() + "," + word;
                if (bigram_frequencies.has(bigram)) {
                    bigram_frequencies.set(bigram, bigram_frequencies.get(bigram) + 1);
                } else {
                    bigram_frequencies.set(bigram, 1);
                }
            }
        }

        let id = clip.id;
        unigram_frequencies.set(id, transcript.length);
        bigram_frequencies.set(id, transcript.length - 1);
        unigrams.set(id, unigram_frequencies);
        bigrams.set(id, bigram_frequencies);
        processedClips.push(clip);
      } 
    }
  }

  const computeTFIDF = () => {

    var unigram_score = Array(unigrams.size).fill(1);
    var bigram_score = Array(unigrams.size).fill(1);

    for (let i = 0; i < searchStr.length; i++) {
        var uni_tfidf = []; //each index is the tfidf score for each document for a given word
        var bi_tfidf = []; 
        var uni_df = 0;
        var bi_df = 0;
        for (const clip of clips) {
          if (clip.status == "Processed" || clip.status == "Finished") {
            if (unigrams.get(clip.id).has(searchStr[i])) {
                var uni_count = unigrams.get(clip.id).get(searchStr[i]);
                uni_count /= unigrams.get(clip.id).get(clip.id);
                uni_tfidf.push(uni_count);
                uni_df += 1;
            } else {
                uni_tfidf.push(0);
            }

            if (i > 0) {
                let bigram = searchStr[i-1] + "," + searchStr[i];
                if (bigrams.get(clip.id).has(bigram)) {
                    var bi_count = bigrams.get(clip.id).get(bigram);
                    bi_count /= bigrams.get(clip.id).get(clip.id);
                    bi_tfidf.push(bi_count);
                    bi_df += 1;
                } else {
                    bi_tfidf.push(0);
                }
            }
          }
        };

        let uni_idf = Math.log((1 + unigram_score.length) / (1 + uni_df)) + 1;
        let bi_idf = Math.log((1 + bigram_score.length) / (1 + bi_df)) + 1;

        for (let j = 0; j < uni_tfidf.length; j++) {
            unigram_score[j] *= (uni_tfidf[j] * uni_idf);
            if (i > 0) {
                bigram_score[j] *= (bi_tfidf[j] * bi_idf);
            }
        }
    }

    var score = Array(unigrams.size).fill(1);
    for (let i = 0; i < unigram_score.length; i++) {
      if (searchStr.length > 1) {
        score[i] = (0.33 * unigram_score[i])  + (0.66 * bigram_score[i]);
      } else {
        score[i] = (0.33 * unigram_score[i]);
      }
    }
    
    return score;
  }

  const findClips = async () => {
    var numResults = 0; //number of clips in the results, these clips got a score of > 0
    
    var clipRating = computeTFIDF(); //each clip in the database will get a rating, the higher the score the more relevant the clip
    numResults = clipRating.filter(v => v > 0).length;

    var sorted = clipRating.slice().sort(function(a,b){return b-a});
    var ranked = clipRating.slice().map(function(v){return sorted.indexOf(v)}); //i.e. [3, 1, 4, 6, 0, 2, 5], 0 --> 5th clip is the best, 6 --> 4th clip is worst

    searchResults = Array(numResults).fill(0);
    var used_indices = []
    for (let i = 0; i < ranked.length; i++) {
        let ranking = ranked[i];
        if (ranking < numResults) {
          let new_ranking = ranking;
          while (used_indices.includes(new_ranking)) {
            new_ranking += 1;
          }
          searchResults[new_ranking] = i;
          used_indices.push(new_ranking);
        }
    }
  }

  const search = async () => {
    await computeFrequencies();

    findClips();

    let sorted_temp = [];
    searchResults.forEach(function(clipIndex) {
        sorted_temp.push(processedClips[clipIndex]);
    });
    setSortedIds(sorted_temp);
  }
  const onClick = (searchText) => {
    setHasSearched(true);
    
    search();
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
        {!hasSearched && 
        <div className="content-container">
            <div className="title" id="main-page-title">
              Audio Archives
            </div>
          
            <div className="search-area">
              <input
              className="autocomplete"
              placeholder="Search your archives"
              value={searchInput}
              onChange={(text) => setSearchInput(text.target.value)}
              id="search-bar"
            />
            <div className="space"></div>
            <Button
              type="primary"
              className="search-button"
              onClick={onClick}
            >Search
            </Button>
            </div>
          </div>
        }
        {hasSearched &&
          <div className="content-results-container">
            <div className="search-area">
              <input
              className="autocomplete"
              placeholder="Search your archives"
              value={searchInput}
              onChange={(text) => setSearchInput(text.target.value)}
              id="search-bar"
              />
              <div className="space"></div>
              <Button
              type="primary"
              className="search-button"
              onClick={onClick}
              >Search
              </Button>
            </div>
            <ul className="flex-container wrap" style={{maxWidth: '70%'}}>
            {sortedIds.map(item => <InterviewTile item={item} />)}
          </ul>
          </div>
        }
      </Content>
    </Layout>
  );
}

const InterviewTile = ({ item }) => {
  console.log(item);
  const history = useHistory();
  const todayDate = new Date();
  const todayString = `${todayDate.getMonth() + 1}/${todayDate.getDate()}/${todayDate.getFullYear()}`
  return (
    <li className={"interview-tile interview-clickable"} onClick={() => {history.push(`/interview_search_preview?key=${item.id}`)}}>
      <div className="interview-tile-upper-container">
        <img src={mic} className="interview-mic" />
        <div className="interview-title"> {item.title || item.filename} </div>
        <div className="interview-title"> {item.speakers} </div>
      </div>
      <div className="interview-tile-lower-container">
        <div className="interview-date"> {item.date || todayString} </div>
      </div>
    </li>
  )
}