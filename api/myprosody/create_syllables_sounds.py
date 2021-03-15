import pickle
import myprosody as mysp

# MAIN FUNCTIONALITY: 
# 
# When you run this, it takes in an audio file and populates 2 things: 
# 1) "syllables", which stores all the timestamps of the syllables uttered
# 2) "silences_and_sounds", which stores all the timestamps when sound/silence starts
#       (i.e. index 0 is the first time there's sound, index 1 is the next silence, index 2 is the next sound)
#
# IMPORTANT NOTES:
# 
# - the audio file must be a .wav file
# - the "path" global variable must point to a folder that includes:
#       - a folder called "dataset", which includes:
#           - a folder called "audioFiles", which contains the audio clip
# 
# - i.e. "/Users/michaellin/Desktop/CS206/audio_analysis/myprosody/dataset/audioFiles/obama_interview_snippet.wav"
#       - file: "obama_interview_snippet"
#       - path: "/Users/michaellin/Desktop/CS206/audio_analysis/myprosody"
#
# I know it's really stupid and annoying that the file has to be inside those two layers of directories, but
# that's the way the "myprosody" package runs and so we can't change that


file = "obama_interview_snippet" # the file name, with the ".wav" stripped
path = "/Users/michaellin/Desktop/CS206/AudioArchives/api/myprosody" # the path that points to "dataset/audioFiles"

syllables = [] # each element represents the timestamp when a syllable is uttered
silences_and_sounds = [] # each element represents the timestamp when it switches from silent to sounding and vice versa. 

def loadFile():
    # TO DO: populate "file" and "path" global variables
    # NOTE: Remove the ".wav" from the end of the filename ("interview.wav" --> "interview")
    pass


# This method will generate a .TextGrid file which will be used in analyzeResultz
def analyzeProsody():
    mysp.myspsyl(file, path) # if syllables.silences_and_sounds aren't populating, try using any of these other ones below
    #mysp.mysppaus(file, path)
    #mysp.myspsr(file, path)
    #mysp.myspatc(file, path)
    #mysp.myspst(file, path)
    #mysp.myspod(file, path)
    #mysp.myspbala(file, path)

def analyzeResults(file):
    loadingSilences = False

    filename = file + ".TextGrid"
    with open(filename,'r') as f:
        data = f.read().split('\n')

        for line in data[15:]: # start looking at points [1]
            line = line.strip(' ')
            linepair = line.split(' = ')
            if linepair[0] == 'number':
                syllables.append(float(linepair[1]))
            elif linepair[0] == 'xmax':
                if loadingSilences:
                    silences_and_sounds.append(float(linepair[1]))
                else:
                    loadingSilences = True

def main():
    loadFile()
    analyzeProsody()
    analyzeResults(path + "/dataset/audioFiles/" + file)
    

if __name__ == "__main__":
    main()