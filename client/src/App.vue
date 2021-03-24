<template>
    <div id="app">
        <div id="game">
            <Game />
        </div>
        <div id="border" />
        <div id="input">
            <Chat />
        </div>
    </div>
</template>

<script>
    import Chat from './components/Chat.vue';
    import Game from './components/Game.vue';

    export default {
        name: 'App',
        components: {
            Chat,
            Game
        }
    }
</script>

<style>
    #app {
        font-family: 'Trebuchet MS';
        text-align: left;
        background-color: rgb(183, 189, 65);
        color: rgb(23, 228, 228);
        display: flex;
    }
    #game {
        width: 60vw;
        height: 100vh;
    }
    #input {
        width: 40vw;
        height: 50vh;
    }
    #border {
        border-right: 2px solid cyan;
    }
    @media (max-width: 1000px) {
        #app {
            flex-direction: column;
        }
        #game {
            width: 100vw;
            height: 50vh;
        }
        #input {
            width: 100vw;
            height: 50vh;
        }
    }
</style>