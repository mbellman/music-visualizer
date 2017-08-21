import 'GUI/FileSelection/FileSelectionView';
import 'GUI/App/AppStyles.less';
import { View } from 'Base/Core';

export default class AppView extends View {
  protected render (): string {
    return (`
      <div class="App">
        <view type="FileSelectionView" />
      </div>
    `);
  }
}
