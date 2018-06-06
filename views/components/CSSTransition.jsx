import React from 'react';
import {CSSTransition} from 'react-transition-group';

export const Fade = ({
  children,
  ...props
}) => (<CSSTransition {...props} timeout={1000} classNames="fade">{children}</CSSTransition>);

export const Scale = ({
  children,
  ...props
}) => (<CSSTransition {...props} timeout={200} classNames="scale">{children}</CSSTransition>);
