<script>
	import {Route,router} from 'tinro'; 
	import Login from './pages/Login/Login.svelte';
	import Register from './pages/Register/Register.svelte';
	import Welcome from './pages/Welcome/Welcome.svelte';
	import Product from './pages/Product/Product.svelte';
	import NewPassword from './pages/NewPass/NewPassword.svelte';
	import Verificate from './pages/Verificate/Verificate.svelte';
	import Map from './pages/Map/Map.svelte';
	import Home from './pages/Home/Home.svelte';
	import Restaurant from './pages/Restaurant/Restaurant.svelte';

	function onLoginSuccess() {
		router.goto('/home');
	}

	function onSingUp () {
		router.goto('/login');
	}

	function onSend () {
		router.goto('/verificate');
	}

	function onRestaurant() {
		router.goto('/restaurant');
	}
</script>

<main></main>

<Route path="/"><Welcome /></Route>
<Route path="/login"><Login onLoginSuccess={onLoginSuccess} /></Route>
<Route path="/register"><Register onSingUp={onSingUp} /></Route>
<Route path="/newPass"><NewPassword onSend={onSend} /></Route>
<Route path="/verificate"><Verificate /></Route>
<Route path="/home"><Home onRestaurant={onRestaurant} /></Route>
<Route path="/restaurant"><Restaurant /></Route>
<Route path="/product">
	<Product />
</Route>
<Route path="/product/map"><Map /></Route>
