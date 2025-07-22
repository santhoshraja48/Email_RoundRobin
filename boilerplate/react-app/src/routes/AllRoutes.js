import Todo from "../pages/Todo";
import Chat from "../pages/Chat";
import { Routes, Route } from 'react-router-dom';

export const AllRoutes = () => {
  return (
    <div className='dark:bg-slate-800'>
      <Routes>
        <Route path='/' element={<Todo />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </div>
  );
};
