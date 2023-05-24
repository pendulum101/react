import * as React from 'react';
import PropTypes from 'prop-types';
const App_Button = () => {
  const [isOpen, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  }

  return (
      <div>
        <Button onClick={handleOpen}> Remove</Button>
        {/*{isOpen && <div>Content</div>}*/}
      </div>
  );
};

const Button = ({onClick, id, children}) => {
  return (
      <button id={id} type="button" onClick={onClick}>
        {children}
      </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.string,
  id: PropTypes.string
}
export default App_Button;