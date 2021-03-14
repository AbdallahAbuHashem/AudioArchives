/*
 * search.js Functionality: 
 * 
 * Input:
 *      - clip jsons in the bucket
 *      - user search string
 *      - user search tags
 *          - format: {"speakers": ["obama"], "date": ["2020"], "location": [], "topics": ["michigan", "voters"]}
 * Output:
 *      - sorted list of clip ID's to be displayed in order, stored in "sortedIds"
 *
 * 1) loadData [TO DO:]
 *      - load the clip jsons into global variable "clips", which is a list of jsons
 *      - load the search string into global variable "search", which is a list of the words, in order, and lowercase
 *      - load the search tags into global variable "tags", which is a map
 * 2) computeFrequencies
 *      - loads the unigram/bigram frequences for easy acess in the TF-IDF search
 * 3) expandTags
 *      - expnds the metadata of each clip to search for substrings
 *      - i.e. ["Michelle Obama", "Oprah Winfrey"] --> ["Michelle Obama", "Oprah Winfrey", "Michelle", "Obama", "Oprah", "Winfrey"]
 *      - i.e. "21-03-2020" --> ["21-03-2020", "03-2020", "2020"]
 * 4) searchClips
 *      - calls findClips, which returns list of clips sorted by TF-IDF
 *      - current weights: bigrams weight = 66%,  unigrams weight = 33%
 *      - calls applyFilters, which filters based on the user search tags
 *
 * ASSUMPTIONS:
 *      - The format of the of each clip json/metadata (see clip examples below)
 *      - The format of the search tags (see format above)
 *      - Each speaker is "Firstname Lastname"
 *      - Each location is "City, State"
 *      - Each date is xx-xx-xxxx, where it's day-month-year
 *      - Each topic is 1-2 words
 */


// EXAMPLE CLIP 1
var clip_example_1 =  
{
    "output": [
        {
            "word": "Are",
            "start_time": 4.4,
            "end_time": 4.8,
            "speaker_tag": 1,
            "sound": "Speech"
        },
        {
            "word": "we",
            "start_time": 4.8,
            "end_time": 5.0,
            "speaker_tag": 1,
            "sound": "Speech"
        },
        {
            "word": "ready",
            "start_time": 5.0,
            "end_time": 5.2,
            "speaker_tag": 1,
            "sound": "Speech"
        }
    ], 
    "sounds": ["random", "stuff"],
    "id": "some-string-here-michelle",
    "title": "michelle_interview.mp3",
    "speakers": ["Michelle Obama", "Oprah Winfrey"], // assumes each speaker is Firstname Lastname
    "location": "Stanford, CA", // assumes the location is City, State
    "date": "21-03-2020", // assumes the date is xx-xx-xxxx, where it's day-month-year
    "length": 246.5, 
    "topics": ["election 2012", "michigan voters"] // assumes each topic is 1-2 words
}

// EXAMPLE CLIP 2
var clip_example_2 = 
{
    "output": [
        {
            "word": "we",
            "start_time": 4.4,
            "end_time": 4.8,
            "speaker_tag": 1,
            "sound": "Speech"
        },
        {
            "word": "we",
            "start_time": 4.8,
            "end_time": 5.0,
            "speaker_tag": 1,
            "sound": "Speech"
        },
        {
            "word": "ready",
            "start_time": 5.0,
            "end_time": 5.2,
            "speaker_tag": 1,
            "sound": "Speech"
        }
    ], 
    "sounds": ["random", "stuff"],
    "id": "some-string-here-barack",
    "title": "barack_interview.mp3",
    "speakers": ["Barack Obama", "Oprah Winfrey"],
    "location": "Stanford, CA",
    "date": "21-04-2020",
    "length": 246.5,
    "topics": ["2012 election", "Joe Biden"]
}

//EXAMPLE SEARCH STRING
var input_example = "we ready"; 

//EXAMPLE SEARCH TAGS
var input_tags_example = {"speakers": ["obama"], "date": ["2020"], "location": [], "topics": []};


var clips = []; // all of the clip jsons in the database
var search = []; // each word in the search string, all in lower case
var tags = {}; // map of the tags inputted by the user

var searchResults = []; // will contain indices to the clips that will be returned to the user, sorted by relevance
var sortedIds = []; // will contain the final sorted list of clip ID's

var unigrams = []; //map of words to their frequencies
var bigrams = []; //map of pairs of words to their frequencies


/*
 * initialize all of the data objects to perform the search
 */
function loadData() {

    //TO DO: iterate through all clips in the bucket and append to "clips"

    //TO DO: read in the user search input and assign to "search" (i.e. search = input.toLowerCase().split(" ");

    //TO DO: read in all of the user tags and append to "tags" 


    // These are just for the example above, comment out after implementing the above TO DO's
    clips.push(clip_example_1);
    clips.push(clip_example_2);
    search = input_example.toLowerCase().split(" ");
    tags = input_tags_example;
}

/*
 * compute the unigram and bigram frequences and store in "unigrams" and "bigrams"
 */
function computeFrequencies() {
    clips.forEach(function(clip) {
        var unigram_frequencies = new Map();
        var bigram_frequencies = new Map();
        
        let transcript = clip["output"];

        for (let i = 0; i < transcript.length; i++) {
            word = transcript[i]["word"].toLowerCase();
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

        id = clip["id"];
        unigrams[id] = unigram_frequencies;
        bigrams[id] = bigram_frequencies
    });
}

/*
 * expands the tags for each clip to include substrings
 */
function expandTags() {
    clips.forEach(function(clip) {
        let tempSpeakers = clip["speakers"].slice();
        tempSpeakers.forEach(function(speaker) { // assumes each speaker is Firstname Lastname
            let fullName = speaker.split(" ");
            clip["speakers"] = clip["speakers"].concat(fullName);
        });

        var location = clip["location"].split(", "); // assumes the location is City, State
        location.push(clip["location"]);
        clip["location"] = location;

        var date = []; // assumes the date is xx-xx-xxxx, where it's day-month-year
        date.push(clip["date"]);
        date.push(clip["date"].substring(3));
        date.push(clip["date"].substring(6));
        clip["date"] = date;

        let tempTopics = clip["topics"].slice();
        tempTopics.forEach(function(topic) { // assumes each topic is 1-2 words
            let fullTopic = topic.split(" ");
            clip["topics"] = clip["topics"].concat(fullTopic);
        });
    });
}

/*
 * calculates the unigram and bigram TF-IDF weight for each word/clip and multiplies all of the weights of a given clip to get a final score
 */
function computeTFIDF() {
    var unigram_score = Array(clips.length).fill(1);
    var bigram_score = Array(clips.length).fill(1);

    for (let i = 0; i < search.length; i++) {
        var uni_tfidf = []; //each index is the tfidf score for each document for a given word
        var bi_tfidf = []; 
        var uni_df = 0;
        var bi_df = 0;
        clips.forEach(function(clip) {
            if (unigrams[clip["id"]].has(search[i])) {
                var uni_count = unigrams[clip["id"]].get(search[i]);
                uni_count /= clip["output"].length;
                uni_tfidf.push(uni_count);
                uni_df += 1;
            } else {
                uni_tfidf.push(0);
            }

            if (i > 0) {
                let bigram = search[i-1] + "," + search[i];
                if (bigrams[clip["id"]].has(bigram)) {
                    var bi_count = bigrams[clip["id"]].get(bigram);
                    bi_count /= (clip["output"].length - 1);
                    bi_tfidf.push(bi_count);
                    bi_df += 1;
                } else {
                    bi_tfidf.push(0);
                }
            }
        });

        let uni_idf = Math.log((1 + unigram_score.length) / (1 + uni_df)) + 1;
        let bi_idf = Math.log((1 + bigram_score.length) / (1 + bi_df)) + 1;

        for (let j = 0; j < uni_tfidf.length; j++) {
            unigram_score[j] *= (uni_tfidf[j] * uni_idf);
            if (i > 0) {
                bigram_score[j] *= (bi_tfidf[j] * bi_idf);
            }
        }
    }

    var score = Array(clips.length).fill(1);
    for (let i = 0; i < unigram_score.length; i++) {
        score[i] = (0.33 * unigram_score[i])  + (0.66 * bigram_score[i]);
    }
    return score;
}

/*
 * populates "searchResults" with a sorted list of indexes into "clips", by most relevant to least relevant
 */
function findClips() {
    var numResults = 0; //number of clips in the results, these clips got a score of > 0
    
    var clipRating = computeTFIDF(); //each clip in the database will get a rating, the higher the score the more relevant the clip
    numResults = clipRating.filter(v => v > 0).length;

    var sorted = clipRating.slice().sort(function(a,b){return b-a});
    var ranked = clipRating.slice().map(function(v){return sorted.indexOf(v)}); //i.e. [3, 1, 4, 6, 0, 2, 5], 0 --> 5th clip is the best, 6 --> 4th clip is worst

    searchResults = Array(numResults).fill(0);
    for (let i = 0; i < ranked.length; i++) {
        let ranking = ranked[i];
        if (ranking < numResults) {
            searchResults[ranking] = i;
        }
    }
}

/*
 * removes all of the results in prelimResults that don't include the tagged inputs
 */
function applyTagFilters(prelimResults, tag) {
    var filteredResults = [];

    if (tags[tag].length > 0) {
        let filters = tags[tag].map(v => v.toLowerCase());
        prelimResults.forEach(function(clip) {
            let clip_tags = clips[clip][tag].map(v => v.toLowerCase());
            if (clip_tags.some(r=> filters.includes(r))) {
                filteredResults.push(clip);
            }
        });
    } else {
        return prelimResults;
    }
    return filteredResults;
}

/*
 * applies all of the tag filters
 */
function applyFilters() {
    var filteredResults = applyTagFilters(searchResults, "speakers");
    filteredResults = applyTagFilters(filteredResults, "date");
    filteredResults = applyTagFilters(filteredResults, "location");
    searchResults = applyTagFilters(filteredResults, "topics");
}

/*
 * populates and filters searchResults, which is used to return a sorted list of the clip titles
 */
function searchClips() {
    findClips();
    applyFilters();

    searchResults.forEach(function(clipIndex) {
        sortedIds.push(clips[clipIndex]["id"]);
    });
}


loadData();
computeFrequencies();
expandTags();
searchClips();
console.log(sortedIds);
