import type { ReactElement } from 'react';
import React, { useContext } from 'react';
import classNames from 'classnames';
import { Button, ButtonVariant } from './buttons/Button';
import LogContext from '../contexts/LogContext';
import type { LogEvent } from '../hooks/log/useLogQueue';
import { TargetType } from '../lib/log';
import { useAuthContext } from '../contexts/AuthContext';
import { AuthTriggers } from '../lib/auth';

interface ClassName {
  container?: string;
  button?: string;
}

interface LoginButtonProps {
  className?: ClassName;
}

enum ButtonCopy {
  Login = 'Log in',
  Signup = 'Sign up',
}
const getLogEvent = (copy: ButtonCopy): LogEvent => ({
  event_name: 'click',
  target_type:
    copy === ButtonCopy.Login
      ? TargetType.LoginButton
      : TargetType.SignupButton,
  target_id: 'header',
});

export default function LoginButton({
  className = {},
}: LoginButtonProps): ReactElement {
  const { logEvent } = useContext(LogContext);
  const { showLogin } = useAuthContext();
  const onClick = (copy: ButtonCopy) => {
    logEvent(getLogEvent(copy));
    showLogin({
      trigger: AuthTriggers.MainButton,
      options: {
        isLogin: copy === ButtonCopy.Login,
      },
    });
  };

  return (
    <span className={classNames('flex flex-row', className?.container)}>
      <Button
        onClick={() => onClick(ButtonCopy.Login)}
        variant={ButtonVariant.Secondary}
        className={className?.button}
      >
        {ButtonCopy.Login}
      </Button>
      <Button
        onClick={() => onClick(ButtonCopy.Signup)}
        variant={ButtonVariant.Primary}
        className={className?.button}
      >
        {ButtonCopy.Signup}
      </Button>
    </span>
  );
}
