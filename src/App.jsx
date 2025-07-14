import { ToastContainer } from 'react-toastify';
import MainRoutes from "./app/routes/MainRoutes";

function App() {

  return(
    <>
        <MainRoutes />;
        <ToastContainer position="top-right" autoClose={3000}/>
    </>
    
)}

export default App;