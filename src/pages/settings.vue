<template>
    <!-- <div class="settings-container">
    </div> -->
    <v-container class="fade-in fill-height d-flex align-center justify-center">
        <v-row>
            <v-col cols="12" class="d-flex flex-column align-center">
                <v-list-subheader class="mb-4 text-center">
                    <v-icon class="mr-2" color="primary">mdi-cog</v-icon>
                    Configurações
                </v-list-subheader>

                <v-switch
                    v-model="isDark"
                    :label="isDark ? '🌙 Modo Escuro' : '☀️ Modo Claro'"
                    inset
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'

const isDark    = ref(false)
const theme     = useTheme()

onMounted(() => {
    const storedTheme       = localStorage.getItem('appTheme')
    isDark.value            = storedTheme === 'dark'
    theme.global.name.value = isDark.value ? "dark" : "light";
})

watch(isDark, (val) => {
    const newTheme = val ? "dark" : "light";
    localStorage.setItem('appTheme', newTheme);
    theme.global.name.value = newTheme;
})
</script>

<style scoped>
.settings-container {
    display         : flex;
    align-items     : center;
    justify-content : center;
    height          : 100vh;
}
</style>