<template>
    <div id="app">
        <div id="game">
            <Game />
        </div>
    </div>
</template>

<script>
    
    import Game from './components/Game.vue';

    export default {
        name: 'App',
        components: {
            Game
        }
    }
</script>

<style>
    #app {
        font-family: 'Trebuchet MS';
        text-align: left;
        background-color: rgb(71, 84, 84);
        color: rgb(23, 228, 228);
        display: flex;
    }
    #game {
        width: 100vw;
        height: 100vh;
    }
    
    @media (max-width: 1000px) {
        #app {
            flex-direction: column;
        }
        #game {
            width: 100vw;
            height: 50vh;
        }
    }
</style>