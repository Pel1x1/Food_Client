import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Recipes from './pages/Recipes';
import Recipe from './pages/Recipe';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import Favourites from './pages/Favourites';
import Cart from './pages/Cart';
import AIRecipe from './pages/AIRecipe';


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Recipes />} />
        <Route path="/recipe/:documentId" element={<Recipe />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/ai-recipe" element={<AIRecipe />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
