<template>
    <v-main>
        <router-view />
    </v-main>

    <BottomNavigation />
</template>

<script setup>
//
</script>

<style>
.fade-in {
    opacity: 0;
    animation: fadeIn .25s ease-in forwards;
}

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}
</style>
