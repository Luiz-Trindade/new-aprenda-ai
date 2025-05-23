<template>
    <v-bottom-navigation v-model="value" color="primary" grow mandatory>
        <v-btn v-for="item in items" :key="item.value" :value="item.value" class="tab-btn"
            :class="{ active: value === item.value }">
            <v-icon>{{ item.icon }}</v-icon>
            {{ item.label }}
        </v-btn>
    </v-bottom-navigation>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('recents')

const items = [
    { value: 'recents', icon: 'mdi-home', label: '' },
    { value: 'favorites', icon: 'mdi-heart', label: '' },
    { value: 'nearby', icon: 'mdi-cog', label: '' },
]
</script>

<style scoped>
.tab-btn {
    transition: transform 0.2s ease-in-out;
}

.tab-btn.active {
    transform: scale(1.1);
}
</style>
