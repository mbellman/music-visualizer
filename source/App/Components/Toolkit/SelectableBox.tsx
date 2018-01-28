import Selectable, { ISelectableProps } from '@components/Toolkit/Selectable';
import { h } from 'preact';
import '@styles/Toolkit/SelectableBox.less';

interface ISelectableBoxProps extends ISelectableProps {}

const SelectableBox = ({ ...props }: ISelectableBoxProps) => {
  return <Selectable className={ 'selectable-box' } { ...props } />;
};

export default SelectableBox;
