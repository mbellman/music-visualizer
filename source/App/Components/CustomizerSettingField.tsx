import NumberField, { INumberFieldProps } from '@components/Toolkit/NumberField';
import { ActionCreators } from '@state/ActionCreators';
import { AnyComponent } from 'preact';
import { bindActionCreators, Dispatch } from 'redux';
import { Callback } from '@base';
import { connect } from 'preact-redux';
import { IAppState } from '@state/Types';
import { ICustomizer, ICustomizerSettings } from '@core/Visualization/Types';
import '@styles/CustomizerSettingField.less';

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
