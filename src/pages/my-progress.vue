<template>
    <v-container class="fade-in fill-height d-flex align-center justify-center">
        <v-row>
            <v-col cols="12" class="d-flex flex-column align-center">
                <v-list-subheader class="mb-4 text-center">
                    <v-icon class="mr-2" color="primary">mdi-chart-line</v-icon>
                    Meu Progresso
                </v-list-subheader>

                <!-- Gráfico de Linha - Progresso Semanal -->
                <v-card class="mb-6 pa-4">
                    <h4 class="mb-4">Atividades esta semana</h4>
                    <apexchart type="line" height="300" :options="weeklyChart.options" :series="weeklyChart.series">
                    </apexchart>
                </v-card>

                <!-- Gráfico de Pizza - Distribuição -->
                <!-- <v-card class="pa-4">
                    <h2 class="mb-4">Distribuição de tempo</h2>
                    <apexchart type="pie" height="300" :options="distributionChart.options"
                        :series="distributionChart.series"></apexchart>
                </v-card> -->
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            weeklyChart: {
                series: [{
                    name: "Horas dedicadas",
                    data: [2, 3, 1, 4, 2, 5, 0]
                }],
                options: {
                    chart: {
                        toolbar: { show: false }
                    },
                    colors: ['#1976D2'],
                    xaxis: {
                        categories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
                    }
                }
            },
            // distributionChart: {
            //     series: [35, 25, 20, 20],
            //     options: {
            //         labels: ['Estudos', 'Trabalho', 'Lazer', 'Outros'],
            //         colors: ['#4CAF50', '#2196F3', '#FFC107', '#9E9E9E'],
            //         legend: {
            //             position: 'bottom'
            //         }
            //     }
            // }
        }
    }
}
</script>

<style scoped>


.primary--text {
    color: #1976D2;
}
</style>