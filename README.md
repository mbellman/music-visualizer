# music-visualizer
A music visualizer.

To-do:

**MIDI Conversion**
* Register dynamic tempo changes

**Audio Stream Visualization/Frequency Analysis**
* No progress yet

**Visualizer**
* Post-processing filters

**UI**
* Channel names/instrument listings
* Channel settings up/down swapping
* Save/load customization profiles

**Code cleanup**
* Reducer refactoring
* - Remove playlist/selected track stuff
* - Use combineReducers with separate reducer functions:
* - - audioFile
* - - sequence
* - - customizer
* - - viewMode
* Create an AudioPlayer component for handling delay behavior/clean up PlayerControls component
* Move Channel.getLastNoteAtPitch() logic into MidiLoader
