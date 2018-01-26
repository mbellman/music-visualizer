import '@styles/Toolkit/SelectableBox.less';

import Selectable, { ISelectableProps } from '@components/Toolkit/Selectable';
import { h } from 'preact';

interface ISelectableBoxProps extends ISelectableProps {}

const SelectableBox = ({ ...props }: ISelectableBoxProps) => {
  return <Selectable className={ 'selectable-box' } { ...props } />;
};

export default SelectableBox;
