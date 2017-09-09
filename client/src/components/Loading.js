import React from 'react';
import { observer, inject } from 'mobx-react';
import { Modal } from 'react-overlays';


const modalStyle = {
  position: 'fixed',
  zIndex: 1040,
  top: 0, bottom: 0, left: 0, right: 0
};

const backdropStyle = {
  ...modalStyle,
  zIndex: 'auto',
  backgroundColor: '#000',
  opacity: 0.3
};

const dialogStyle = {
  position: 'absolute',
  top: '35%', left: '50%',
  transform: `translate(-50%, -50%)`,
  outline: 'none',
};

@inject('store')
@observer
export default class Loading extends React.Component {
  render() {
    const { store } = this.props;
    return (
      <Modal
        show={store.requesting}
        style={modalStyle}
        backdropStyle={backdropStyle}
      >
        <div style={dialogStyle} className="loader" />
      </Modal>
    );
  }
}
