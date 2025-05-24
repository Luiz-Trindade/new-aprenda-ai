<template>
    <v-container class="fade-in fill-height d-flex align-center justify-center">
        <v-row>
            <v-col cols="12" class="d-flex flex-column align-center">
                <!-- Cabeçalho -->
                <v-list-subheader class="mb-4 text-center">
                    <v-icon class="mr-2" color="primary">mdi-robot</v-icon>
                    Aprenda-AI
                </v-list-subheader>

                <!-- Status do Usuário -->
                <v-card block class="mb-6 pa-4 text-center elevation-2" width="100%">
                    <v-icon color="primary" size="large">mdi-robot-happy</v-icon>
                    <p class="mt-2 mb-0 text-body-1">Bem-vindo ao seu aprendizado!</p>
                    <p class="text-caption text-medium-emphasis">
                        <v-icon class="mr-1" color="primary" size="small">
                            mdi-clock-time-four-outline
                        </v-icon>
                        Você possui 36 horas de aprendizado!
                    </p>
                </v-card>

                <!-- Tópico aleatório -->
                <v-card class="mb-6 elevation-2" width="100%" v-if="randomTopic">
                    <v-card-title class="text-body-1">
                        <v-icon class="mr-2">mdi-lightbulb-on</v-icon>
                        Tópico aleatório
                    </v-card-title>
                    <v-card-text>
                        <strong>{{ randomTopic.title }}</strong>
                        <p class="text-caption mt-1">{{ getTopicDescription(randomTopic.difficulty) }}</p>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn variant="flat" color="success" block rounded="xl" class="elevation-2"
                            @click="startTopic(randomTopic)">
                            <v-icon start>mdi-play</v-icon>
                            Começar
                        </v-btn>
                    </v-card-actions>
                </v-card>

                <!-- Botões Principais -->
                <v-card class="mb-6 elevation-2" width="100%" style="padding: 10px;">
                    <v-card-title class="text-body-1">
                        <v-icon class="mr-2">mdi-cog</v-icon>
                        Ações
                    </v-card-title>

                    <v-row>
                        <v-col cols="12" class="d-flex flex-column align-center">
                            <v-btn block v-for="(item, i) in mainActions" :key="i" color="primary"
                                class="mb-3 elevation-2" rounded="xl" @click="handleAction(item.action)">
                                <v-icon start>{{ item.icon }}</v-icon>
                                {{ item.text }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Dados do usuário
const completedTopics = ref(3);
const totalTopics = ref(10);

// Tópicos e tópico aleatório
const topics = ref([]);
const randomTopic = ref(null);

// Carregar tópicos do localStorage
function loadTopics() {
    const savedTopics = localStorage.getItem('topics');
    if (savedTopics) {
        topics.value = JSON.parse(savedTopics);
        selectRandomTopic();
    }
}

// Seleciona um tópico aleatório
function selectRandomTopic() {
    if (topics.value.length > 0) {
        const randomIndex = Math.floor(Math.random() * topics.value.length);
        randomTopic.value = topics.value[randomIndex];
    }
}

// Gera descrição com base na dificuldade
function getTopicDescription(difficulty) {
    const descriptions = {
        'Fácil': 'Ótimo para iniciantes neste assunto',
        'Médio': 'Desafio intermediário para expandir seu conhecimento',
        'Difícil': 'Para quem quer testar os limites do aprendizado',
        'Variado': 'Mistura de conceitos para um aprendizado diversificado'
    };
    return descriptions[difficulty] || 'Explore este tópico para aprender algo novo';
}

// Ações principais
const mainActions = [
    { text: "Explorar Tópicos", icon: "mdi-book-open", action: "explore" },
    { text: "Testar Conhecimento", icon: "mdi-play-circle", action: "quiz" },
    { text: "Meu Progresso", icon: "mdi-chart-line", action: "progress" },
];

// Manipulador de ações
function handleAction(action: string) {
    switch (action) {
        case "explore":
            router.push("/topics");
            break;
        case "quiz":
            startRandomQuiz();
            break;
        case "progress":
            router.push("/progress");
            break;
    }
}

// Iniciar tópico específico
function startTopic(topic: any) {
    router.push(`/learn/${topic.id}`);
}

// Iniciar quiz aleatório
function startRandomQuiz() {
    if (topics.value.length > 0) {
        const randomIndex = Math.floor(Math.random() * topics.value.length);
        router.push(`/quiz/${topics.value[randomIndex].id}`);
    } else {
        alert('Nenhum tópico disponível para quiz');
    }
}

// Carrega os tópicos quando o componente é montado
onMounted(() => {
    loadTopics();
});
</script>

<style scoped>

</style>