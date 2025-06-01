<template>
    <v-container class="fade-in fill-height d-flex align-center justify-center">
        <v-row>
            <v-col cols="12" class="d-flex flex-column align-center">
                <v-list-subheader class="mb-4 text-center">
                    <v-icon class="mr-2" color="primary">mdi-chart-line</v-icon>
                    Meu Progresso
                </v-list-subheader>

                <!-- Gráfico de Pizza - Distribuição -->
                <v-card class="pa-4">
                    <h4 class="mb-4">Distribuição de acertividade</h4>
                    <apexchart 
                        type="pie" 
                        :options="distributionChart.options" 
                        :series="distributionChart.series"
                    >
                    </apexchart>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            distributionChart: {
                series: [],
                options: {
                    chart: {
                        type: 'pie',
                    },
                    labels: [],
                    legend: {
                        position: 'bottom'
                    },
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 300
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                }
            }
        }
    },

    mounted() {
        this.extractTitlesAndProgress();
    },

    methods: {
        extractTitlesAndProgress() {
            try {
                const topicsString = localStorage.getItem("topics");
                if (!topicsString) {
                    console.warn("Nenhum tópico encontrado no localStorage");
                    return;
                }

                const topicsArray = JSON.parse(topicsString);
                
                // Extrai apenas os títulos para os labels
                this.distributionChart.options.labels = topicsArray.map(topic => topic.title);
                
                // Extrai apenas os progressos para as séries
                this.distributionChart.series = topicsArray.map(topic => topic.progress);
                
                console.log("Dados do gráfico atualizados:", {
                    labels: this.distributionChart.options.labels,
                    series: this.distributionChart.series
                });
            } catch (error) {
                console.error("Erro ao processar tópicos:", error);
            }
        }
    }
}
</script>

<style scoped>
.primary--text {
    color: #1976D2;
}
</style>