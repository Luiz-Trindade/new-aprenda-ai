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

                <!-- Tópico do Dia -->
                <v-card class="mb-6 elevation-2" width="100%">
                    <v-card-title class="text-body-1">
                        <v-icon class="mr-2">mdi-lightbulb-on</v-icon>
                        Tópico do Dia
                    </v-card-title>
                    <v-card-text>
                        <strong>{{ topicOfTheDay.title }}</strong>
                        <!-- <p class="text-caption mt-1">{{ topicOfTheDay.description }}</p> -->
                    </v-card-text>

                    <v-card-actions>
                        <v-btn 
                            variant="flat" 
                            color="success" 
                            block 
                            rounded="xl"
                            class="elevation-2"
                            @click="startTopic(topicOfTheDay)"
                        >
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
                            <v-btn 
                                block 
                                v-for="(item, i) in mainActions" 
                                :key="i" 
                                color="primary" 
                                class="mb-3 elevation-2" 
                                rounded="xl" 
                                @click="handleAction(item.action)"
                            >
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
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Dados do usuário
const completedTopics = ref(3);
const totalTopics = ref(10);

// Tópico do dia
const topicOfTheDay = ref({
    id: "neural-networks",
    title: "Redes Neurais Básicas",
    description: "Entenda os fundamentos de perceptrons e MLPs",
});

// Ações principais
const mainActions = [
    { text: "Explorar Tópicos", icon: "mdi-book-open", action: "explore" },
    { text: "Criar Novo Tópico", icon: "mdi-plus-circle", action: "create" },
    { text: "Testar Conhecimento", icon: "mdi-play-circle", action: "quiz" },
    { text: "Meu Progresso", icon: "mdi-chart-line", action: "progress" },
];

// Manipulador de ações
function handleAction(action: string) {
    switch (action) {
        case "explore":
            router.push("/topics");
            break;
        case "create":
            router.push("/create-topic");
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
    console.log("Iniciando tópico:", topic.title);
    // Implemente a navegação para o tópico
    router.push(`/learn/${topic.id}`);
}

// Iniciar quiz aleatório
function startRandomQuiz() {
    console.log("Iniciando quiz aleatório");
    router.push("/quiz/random");
}
</script>

<style scoped>




.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-btn {
    border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

.v-btn--variant-elevated {
    background: linear-gradient(145deg,
            rgba(var(--v-theme-primary), 1),
            rgba(var(--v-theme-primary), 0.9));
}
</style>