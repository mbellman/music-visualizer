import 'GUI/FileList/FileListView';
import 'GUI/FileSelection/FileSelectionView';
import 'GUI/App/AppStyles.less';
import { View } from 'Base/Core';

export default class AppView extends View {
  /**
   * @override
   */
  protected render (): string {
    return (`
      <div class="App">
        <View:FileListView>
        <View:FileSelectionView>
      </div>
    `);
  }
}
