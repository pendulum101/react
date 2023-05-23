import * as React from 'react';
import PropTypes, {element} from 'prop-types';
const App_Button = () => {
  const [isOpen, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  }

  return (
      <div>
        <Button onClick={handleOpen}> Open</Button>
        {isOpen && <div>Content</div>}
      </div>
  );
};

const Button = ({onClick, children}) => {
  return (
      <button type="button" onClick={onClick}>
        {children}
      </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.string
}
export default App_Button;