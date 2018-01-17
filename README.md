# music-visualizer
A music visualizer.

To-do:

**MIDI Conversion**
* Register dynamic tempo changes

**Audio Stream Visualization/Frequency Analysis**
* No progress yet

**Visualizer**
* Rendering optimizations
* Improve vertical scaling
* Handle effects on a per-track basis
* Real-time tempo adjustments

**UI**
* Add a settings screen for customizing effects + tempo
* Add an active tracks list

**Code cleanup**
* Remove Sequence/Channel/Note stuff from MIDI directory
* Remove Channel.getLastNoteOfPitch(), see if there's a better way of solving the note-off problem
* MidiLoader tidying