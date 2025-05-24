<template>
    <v-bottom-navigation v-model="activeTab" color="primary" grow mandatory>
        <v-btn 
            v-for="item in items" 
            :key="item.value" 
            :value="item.value" class="tab-btn"
            :class="{ active: activeTab === item.value }" 
            @click="navigateTo(item.route)"
        >
            <v-icon>{{ item.icon }}</v-icon>
            {{ item.label }}
        </v-btn>
    </v-bottom-navigation>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router    = useRouter()
const route     = useRoute()

// Define as rotas correspondentes a cada aba
const items = [
    { value: 'home',        icon: 'mdi-home',                   label: '', route: '/' },
    { value: 'topics',      icon: 'mdi-format-list-bulleted',   label: '', route: '/topics' },
    { value: 'results',     icon: 'mdi-chart-bar',              label: '', route: '/results' },
    { value: 'settings',    icon: 'mdi-cog',                    label: '', route: '/settings' },
]

// Define a aba ativa com base na rota atual
const activeTab = ref(items.find(item => item.route === route.path)?.value || 'home')

// Observa mudanças na rota para atualizar a aba ativa
watch(() => route.path, (newPath) => {
    const matchingItem = items.find(item => item.route === newPath)
    if (matchingItem) {
        activeTab.value = matchingItem.value
    }
})

// Função para navegar entre as rotas
const navigateTo = (routePath: string) => {
    router.push(routePath)
}
</script>

<style scoped>
.tab-btn {
    transition: transform 0.25s ease-in-out;
}

.tab-btn.active {
    transform: scale(1.25);
}
</style>