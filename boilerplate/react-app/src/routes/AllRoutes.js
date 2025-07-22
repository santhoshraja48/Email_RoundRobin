import Todo from "../pages/EmailGenerator";
import Chat from "../pages/Chat";
import { Routes, Route } from 'react-router-dom';
import Final from "../pages/finalpage";

export const AllRoutes = () => {
  return (
    <div className='dark:bg-slate-800'>
      <Routes>
        <Route path='/' element={<Todo />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/final' element={<Final/>}/>
      </Routes>
    </div>
  );
};
