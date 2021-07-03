import React, { FC, useState, useRef } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuList from '@material-ui/core/MenuList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import styled from 'styled-components';
import { markNotificationRead } from '../../../api/notifications/mark-notification-read';
import { getMeAction } from '../../../redux/me/get-me';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

type APINotification = {
  id: number;
  link: string;
  text: string;
  is_unread: boolean;
};

type Props = {
  notifications: APINotification[];
  getMe?: () => void;
};

export const Notifications: FC<Props> = ({ notifications = [], getMe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const anchorEl = useRef(null);
  const hasUnread = notifications.length > 0;
  return hasUnread ? (
    <div
      className="loginLink menu"
      style={{
        // force display on mobile too
        display: 'block',
      }}
    >
      <div ref={anchorEl}>
        <FontAwesomeIcon
          icon={faBell}
          title="Notifications"
          onClick={() => setIsOpen(!isOpen)}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <Menu
        open={isOpen}
        className="menu-box"
        disablePortal
        anchorEl={() => anchorEl.current}
      >
        <div className="menu-list">
          <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <MenuList>
              <div className="menu-items">
                {notifications.map(({ id, link, text, is_unread }) => (
                  <MenuItem key={id}>
                    <ItemText
                      onClick={async () => {
                        await markNotificationRead(id);
                        window.location.replace(link);
                      }}
                    >
                      {text}
                    </ItemText>
                    <FontAwesomeIcon
                      icon={faTimes}
                      title="Mark as read"
                      onClick={async () => {
                        await markNotificationRead(id);
                        getMe();
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </MenuItem>
                ))}
              </div>
            </MenuList>
          </ClickAwayListener>
        </div>
      </Menu>
    </div>
  ) : null;
};

const MenuItem = styled.div`
  display: flex;
  margin: 12px;
  align-items: center;
  justify-content: space-between;
  column-gap: 12px;
`;

const ItemText = styled.div`
  cursor: pointer;
  font-family: Courier, 'Courier New', monospace;
  font-size: 12px !important;
  color: black;
`;

const mapDispatchToProps = (dispatch) => {
  return {
    getMe: bindActionCreators(getMeAction, dispatch),
  };
};

const ConnectedNotifications = connect(
  () => ({}),
  mapDispatchToProps,
)(Notifications);

export default ConnectedNotifications;
