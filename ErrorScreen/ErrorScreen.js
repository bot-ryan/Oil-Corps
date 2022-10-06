import { BrowserRouter as Router, Routes} from 'react-router-dom';

const handleClick = () =>{
  console.log("Hello");
}

function ErrorScreen() {
  //let history = useHistory();
  
  return (
    <div className='Error'>Error: Page Not Found.</div>
  );
}

export default ErrorScreen;
