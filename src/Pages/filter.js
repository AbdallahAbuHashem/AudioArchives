/*
 * filter.js Functionality: THIS IS CALLED ONLY WHEN A NEW FILTER IS ADDED, IF USER PRESSES "SEARCH" AGAIN, SEE search.js
 * 
 * Input:
 *      - clip jsons in the bucket
 *      - user search tags
 *          - format: {"speakers": ["obama"], "date": ["2020"], "location": [], "topics": ["michigan", "voters"]}
 *      - pre-filtered results, where each element is a clip ID
 *          - format: ["some-string-here-barack", "some-string-here-michelle"]
 * Output:
 *      - sorted list of clip ID's to be displayed in order, stored in "filteredIds"
 *
 * 1) loadData [TO DO:]
 *      - load the clip jsons into global variable "clips", which is a list of jsons
 *      - load the search tags into global variable "tags", which is a map
 *      - load the prefiltered results into global variable "preFiltered", which is a list of sorted ID's
 * 2) expandTags
 *      - expnds the metadata of each clip to search for substrings
 *      - i.e. ["Michelle Obama", "Oprah Winfrey"] --> ["Michelle Obama", "Oprah Winfrey", "Michelle", "Obama", "Oprah", "Winfrey"]
 *      - i.e. "21-03-2020" --> ["21-03-2020", "03-2020", "2020"]
 * 3) applyFilters
 *      - calls findIndexes, which converts filteredIds to their clips indexes
 *      - applys filter for each tag
 *
 * ASSUMPTIONS:
 *      - The format of the of each clip json/metadata (see search.js for example)
 *      - The format of the search tags (see format above)
 *      - Each speaker is "Firstname Lastname"
 *      - Each location is "City, State"
 *      - Each date is xx-xx-xxxx, where it's day-month-year
 *      - Each topic is 1-2 words
 */

var clips = []; // all of the clip jsons in the database
var tags = {}; // map of the tags inputted by the user
var preFiltered = [] // the sorted list of clip ID's

var filteredIds = []; // will contain the final sorted list of clip ID's after filters

/*
 * initialize all of the data objects to perform the search
 */
function loadData() {

    //TO DO: iterate through all clips in the bucket and append to "clips"

    //TO DO: read in all of the user tags and append to "tags" 

    //TO DO: read in sortedIds (output of search.js) and assign to "preFiltered"

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
 * converts preFiltered to a list of indices
 */
function findIndexes() {
    searchResults = Array(preFiltered.length).fill(0);;

    for (let i = 0; i < clips.length; i++) {
        var index = preFiltered.indexOf(clips[i]["id"]);
        if (index != -1) {
            searchResults[index] = i;
        }
    }

    return searchResults;
}

/*
 * applies all of the tag filters
 */
function applyFilters() {
    var searchResults = findIndexes();

    var filteredResults = applyTagFilters(searchResults, "speakers");
    filteredResults = applyTagFilters(filteredResults, "date");
    filteredResults = applyTagFilters(filteredResults, "location");
    searchResults = applyTagFilters(filteredResults, "topics");

    searchResults.forEach(function(clipIndex) {
        filteredIds.push(clips[clipIndex]["id"]);
    });
}

loadData();
expandTags();
applyFilters();
console.log(filteredIds);
