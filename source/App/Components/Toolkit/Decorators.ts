import { connect } from 'preact-redux';
import { Constructor } from '@base';

export function Connect (...reduxConnectArgs: any[]): ClassDecorator {
  return (constructor: Constructor<any>) => {
    return connect.apply(null, reduxConnectArgs)(constructor);
  };
}
