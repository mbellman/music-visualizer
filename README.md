# music-visualizer
A music visualizer.

To-do:

**MIDI Conversion**
* Register dynamic tempo changes

**Audio Stream Visualization/Frequency Analysis**
* No progress yet

**Visualizer**
* Improve vertical scaling
* Handle effects on a per-track basis
* Real-time tempo adjustments
* Rendering optimizations

**UI**
* Render preview notes in each channel editor
* Add remaining effects options in channel editors
* Add an active tracks list

**Code cleanup**
* Alphabetize imports by path, not module name
* Prune unused imports
* Move Channel.getLastNoteAtPitch() logic into MidiLoader
* Clean up the formulas used in note spawning (Visualizer._runNoteSpawnCheck())
* Remove Sequence/Channel/Note stuff from MIDI directory
* Remove ShapeFactories.ts once options screen allows for full visualizer customization
* MidiLoader tidying