import '@styles/Toolkit/SelectableButton.less';

import Selectable, { ISelectableProps } from '@components/Toolkit/Selectable';
import { Callback, Override } from '@base';
import { h, Component, AnyComponent } from 'preact';
import { connect } from 'preact-redux';
import { Dispatch } from 'redux';

interface ISelectableButtonProps extends ISelectableProps {
  value: string;
}

const SelectableButton = ({ value, ...props }: ISelectableButtonProps) => {
  return (
    <Selectable className={ 'selectable-button' } { ...props }>
      { value }
    </Selectable>
  );
};

export default SelectableButton;
