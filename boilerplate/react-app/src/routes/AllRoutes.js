import Todo from "../pages/Todo";
import Chat from "../pages/Chat";
import Navigation from "../pages/Navication";
import { Routes, Route } from 'react-router-dom';

export const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Navigation />} />
        <Route path='/navigation' element={<Navigation />} />
        <Route path='/chat' element={<Chat />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </div>
  );
};
