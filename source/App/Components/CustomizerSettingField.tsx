import '@styles/CustomizerSettingField.less';

import NumberField, { INumberFieldProps } from '@components/Toolkit/NumberField';
import { connect } from 'preact-redux';
import { IAppState, ICustomizer, ICustomizerSettings } from '@state/Types';
import { Dispatch, bindActionCreators } from 'redux';
import { AnyComponent } from 'preact';
import { ActionCreators } from '@state/ActionCreators';
import { Callback } from '@base';

interface ICustomizerSettingFieldPropsFromState {
  className?: string;
  name?: keyof ICustomizerSettings;
  value?: number;
}

interface ICustomizerSettingFieldPropsFromDispatch {
  onChange?: Callback<KeyboardEvent>;
}

interface ICustomizerSettingFieldProps extends ICustomizerSettingFieldPropsFromState, ICustomizerSettingFieldPropsFromDispatch {
  label: string;
  setting: keyof ICustomizerSettings;
}

function mapStateToProps ({ selectedPlaylistTrack }: IAppState, { setting }: ICustomizerSettingFieldProps): ICustomizerSettingFieldPropsFromState {
  const { settings } = selectedPlaylistTrack.customizer;

  return {
    className: 'customizer-setting-field',
    name: setting,
    value: settings[setting]
  };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>): ICustomizerSettingFieldPropsFromDispatch {
  const { setCustomizerSettings } = ActionCreators;

  return {
    onChange: (e: KeyboardEvent) => {
      const { name, value } = e.target as HTMLInputElement;

      dispatch(setCustomizerSettings({
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