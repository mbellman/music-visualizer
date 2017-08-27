import 'GUI/Styles/AppStyles.less';
import 'GUI/Views/FileListView';
import 'GUI/Views/FileSelectionView';
import { View, Implementation } from 'Base/Core';

export default class AppView extends View {
  @Implementation
  protected render (): string {
    return (`
      <div class="App">
        <View:FileListView>
        <View:FileSelectionView>
      </div>
    `);
  }
}
