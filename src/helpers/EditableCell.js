import React from 'react';
import { Overlay } from 'react-overlays';
import { Input } from 'semantic-ui-react';
import styled from 'styled-components';
import Keys from '../maintable/vendor_upstream/core/Keys';

const CellContainer = styled.div`
  display: flex;
  flex: 1 0 100%;
  align-items: center;
  height: 100%;
  overflow: hidden;
  margin: 2px 5px;
  padding: 5px;
`

class EditableCell extends React.PureComponent {
  state = {
    value: this.props.data ? this.props.data.getObjectAt(this.props.rowIndex)[this.props.columnKey] : this.props.value,
    editing: false,
  }

  setTargetRef = ref => (this.targetRef = ref)

  getTargetRef = () => this.targetRef

  handleClick = () => { 
    this.setState({ editing: true });

  }

  handleHide = () => {
    this.setState({ editing: false });
    if (this.props.data) {
      this.props.data.setObjectAt(this.props.rowIndex, this.props.columnKey, this.state.value);
    }
  }

  handleChange = e =>
  {
    this.setState({
      value: e.target.value,
    });
  }

  handleKey = e =>
  {
    if (e.keyCode == Keys.RETURN) {
      this.handleHide();
      return;
    }
  }

  render() {
    const {container, data, rowIndex, columnKey, width, height,  ...props} = this.props;
    const { value, editing } = this.state;

    const inputStyle = {
      width: width - 10,
      height: height - 5,
      borderRadius: '0px',
    }

    return (
      <CellContainer ref={this.setTargetRef} onClick={this.handleClick}>
        {!editing && value}
        {editing && this.targetRef && (
          <Overlay
            show
            flip
            rootClose
            container={this.getTargetRef}
            target={this.getTargetRef}
            onHide={this.handleHide}>
            {({ props, placement }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  width: this.targetRef.offsetWidth,
                  top:
                    placement === 'top'
                      ? this.targetRef.offsetHeight
                      : -this.targetRef.offsetHeight,
                }}>
                <Input autoFocus value={value} onChange={this.handleChange} style={inputStyle}     
                      onKeyDown={this.handleKey} />
              </div>
            )}
          </Overlay>
        )}
      </CellContainer>
    )
  }
}

export { EditableCell };