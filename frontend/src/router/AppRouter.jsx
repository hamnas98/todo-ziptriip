import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Todos from "../pages/Todos";
import TodoDetails from "../pages/TodoDetails";

const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/todos" replace />} />
				<Route path="/todos" element={<Todos />} />
				<Route path="/todo" element={<TodoDetails />} />
				<Route path="*" element={<Navigate to="/todos" replace />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
