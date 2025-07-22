import Todo from "../pages/EmailGenerator";
import Chat from "../pages/Chat";
import { Routes, Route } from 'react-router-dom';
import Final from "../pages/finalpage";
import InputGet from "../pages/InputGet";
import ToEmail from "../pages/ToEmail"

export const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<InputGet />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/final' element={<Final/>}/>
        <Route path="/todo" element={<Todo />} />
        <Route path="/input-get" element={<InputGet />} />
        <Route path="/to-email" element={<ToEmail />} />

      </Routes>
    </div>
  );
};
