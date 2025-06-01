<template>
    <v-container class="fade-in fill-height d-flex align-center justify-center">
        <v-row>
            <v-col cols="12" md="8" class="d-flex flex-column align-center">
                <v-card width="100%" class="pa-4">
                    <v-card-title class="d-flex align-center">
                        <v-icon color="primary" class="mr-3">mdi-history</v-icon>
                        Histórico de Respostas
                    </v-card-title>

                    <v-card-text v-if="loading">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </v-card-text>

                    <v-card-text v-else-if="userAnswers.length === 0">
                        <p class="text-center">Nenhum histórico de respostas encontrado.</p>
                    </v-card-text>

                    <v-card-text v-else>
                        <div v-for="(answer, index) in userAnswers" :key="index" class="mb-6">
                            <div class="d-flex align-center mb-2">
                                <v-chip :color="answer.isCorrect ? 'success' : 'error'" class="mr-3">
                                    {{ answer.isCorrect ? 'Correta' : 'Incorreta' }}
                                </v-chip>
                                <span class="text-subtitle-1">Pergunta {{ answer.questionIndex + 1 }}</span>
                            </div>

                            <p class="text-h6 font-weight-bold mb-3">{{ answer.questionText }}</p>

                            <div class="ml-4">
                                <p class="mb-1">
                                    <span class="font-weight-bold">Sua resposta:</span>
                                    <span :class="answer.isCorrect ? 'text-success' : 'text-error'">
                                        {{ answer.selectedOptionText }}
                                    </span>
                                </p>

                                <p v-if="!answer.isCorrect" class="mb-1">
                                    <span class="font-weight-bold">Resposta correta:</span>
                                    <span class="text-success">{{ answer.correctAnswerText }}</span>
                                </p>

                                <p class="text-caption text-medium-emphasis mt-2">
                                    Respondido em: {{ formatDate(answer.timestamp) }}
                                </p>
                            </div>

                            <v-divider v-if="index < userAnswers.length - 1" class="my-4"></v-divider>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            userAnswers: []
        }
    },

    mounted() {
        this.loadUserAnswers();
    },

    methods: {
        loadUserAnswers() {
            try {
                const topic_result_id = localStorage.getItem("topic_result_id")
                // const userId = localStorage.getItem("id");
                if (!topic_result_id) {
                    console.warn("ID do tópico não encontrado no localStorage");
                    this.loading = false;
                    return;
                }

                const savedAnswers = localStorage.getItem(topic_result_id);
                if (savedAnswers) {
                    this.userAnswers = JSON.parse(savedAnswers);
                } else {
                    console.warn("Nenhum histórico de respostas encontrado para este usuário");
                }
            } catch (error) {
                console.error("Erro ao carregar respostas:", error);
            } finally {
                this.loading = false;
            }
        },

        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
}
</script>

<style scoped></style>