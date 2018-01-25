import '@styles/CustomizerSettingField.less';

import NumberField, { INumberFieldProps } from '@components/Toolkit/NumberField';
import { connect } from 'preact-redux';
import { IAppState, ICustomizer, ICustomizerSettings } from '@state/Types';
import { Dispatch, bindActionCreators } from 'redux';
import { AnyComponent } from 'preact';
import { ActionCreators } from '@state/ActionCreators';

interface ICustomizerSettingFieldProps extends INumberFieldProps {
  setting: keyof ICustomizerSettings;
}

function mapStateToProps (state: IAppState, props: ICustomizerSettingFieldProps): Partial<ICustomizerSettingFieldProps> {
  const { settings } = state.selectedPlaylistTrack.customizer;
  const { setting: name } = props;

  return {
    className: 'customizer-setting-field',
    name,
    value: settings[name]
  };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>, props: ICustomizerSettingFieldProps): Partial<ICustomizerSettingFieldProps> {
  return {
    onChange: (e: KeyboardEvent) => {
      const { name, value } = e.target as HTMLInputElement;

      dispatch(ActionCreators.setCustomizerSettings({
        [name]: value
      }));
    }
  };
}

const CustomizerSettingField = connect(
  mapStateToProps,
  mapDispatchToProps
)(NumberField as AnyComponent<any, any>);

export default CustomizerSettingField;
